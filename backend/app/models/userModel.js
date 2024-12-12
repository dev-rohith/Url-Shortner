import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresIn: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt();
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && this.isNew) next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = toString(this.passwordChangedAt / 1000, 10);

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(12).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .toString("hex");
  this.passwordResetTokenExpiresIn =
    Date.now() + process.env.RESET_TOKEN_EXPIRE * 60 * 1000;
  return resetToken;
};

const User = model("user", userSchema);

export default User;
