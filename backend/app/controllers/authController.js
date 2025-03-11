import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true, 
    secure: true, 
    sameSite: "None", 
    path: "/", 
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    
  });

  user.password = undefined;
  user.passwordChangedAt = undefined

  res.status(statusCode).json({
    status: "success",
    token,
    user
  });
};


const authCtrl = {};

authCtrl.register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const newUser = await User.create({
    username,
    email,
    password,
  });

  createSendToken(newUser, 201, req, res);
});

authCtrl.login = catchAsync(async (req, res, next) => {
  const { input, password } = req.body;

  if (!input || !password) {
    return next(new AppError("invalid inputs", 400));
  }

  let user;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(input)) {
    user = await User.findOne({ email: input }).select("+password");
  } else {
    user = await User.findOne({ username: input }).select("+password");
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  createSendToken(user, 200, req, res);
});

authCtrl.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

authCtrl.protect = catchAsync(async (req, res, next) => {

 let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }


  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_ACCESS_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = currentUser;
  next();
});


authCtrl.forgotPassword = catchAsync(async (req, res, next) => {
     const user = await User.findOne({ email: req.body.email });
     if (!user) {
       return next(new AppError('There is no user with email address.', 404));
     }
   
     const resetToken = user.createPasswordResetToken();
     await user.save({ validateBeforeSave: false });
   
     try {
       const resetURL = `${req.protocol}://${req.get(
         'host'
       )}/api/v1/users/resetPassword/${resetToken}`;
       await new Email(user, resetURL).sendPasswordReset();
   
       res.status(200).json({
         status: 'success',
         message: 'Token sent to email!'
       });
     } catch (err) {
       user.passwordResetToken = undefined; 
       user.passwordResetExpires = undefined;
       await user.save({ validateBeforeSave: false });
   
       return next(
         new AppError('There was an error sending the email. Try again later!'),
         500
       );
     }
   });
   
   authCtrl.resetPassword = catchAsync(async (req, res, next) => {

    const hashedToken = crypto
       .createHash('sha256')
       .update(req.params.token)
       .digest('hex');
   
     const user = await User.findOne({
       passwordResetToken: hashedToken,
       passwordResetExpires: { $gt: Date.now() }
     });
   
     if (!user) {
       return next(new AppError('Token is invalid or has expired', 400));
     }
     user.password = req.body.password;
     user.passwordConfirm = req.body.passwordConfirm;
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
     await user.save();
   
  
     createSendToken(user, 200, req, res);
   });
   

   authCtrl.updatePassword = catchAsync(async (req, res, next) => {
     const user = await User.findById(req.user.id).select('+password');

   
     if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
       return next(new AppError('Your current password is wrong.', 401));
     }
   
     user.password = req.body.password;
     await user.save();
   
     createSendToken(user, 200, req, res);
   });



   export default authCtrl