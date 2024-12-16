import AppError from "../utils/appError.js";
import axios from "axios";
import catchAsync from "../utils/catchAsync.js";
import { UAParser } from "ua-parser-js";
import sorthash from "short-hash";
import Url from "../models/urlModel.js";

const urlCtrl = {};

urlCtrl.createSort = catchAsync(async (req, res, next) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return next(new AppError("Long URL is required", 400));
  }

  const sortUrl = sorthash(longUrl);

  const newUrl = await Url.create({
    longUrl,
    sortUrl,
    user: req.user._id,
    urlExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ data: newUrl });
});

urlCtrl.accessUrl = catchAsync(async (req, res, next) => {
  const { sortUrl } = req.params;
  const userAgent = req.headers["user-agent"];
  const ip = req.headers["x-forwarded-for"] || "130.245.32.202";

  if (!sortUrl) {
    return next(new AppError("Short URL is required", 400));
  }

  const accessKey = process.env.API_ACCESS_TOKEN;
  const apiUrl = `https://apiip.net/api/check?ip=${ip}&accessKey=${accessKey}`;

  const userInfo = {};

  try {
    const response = await axios.get(apiUrl);
    const { countryName, latitude, longitude } = response.data;
    userInfo.country = countryName || "India";
    userInfo.coordinates = [latitude, longitude];

    const parser = new UAParser(userAgent);
    const deviceInfo = parser.getDevice();
    userInfo.deviceType = deviceInfo.type || "desktop";
  } catch (err) {
    return next(new AppError(`Error fetching IP data: ${err.message}`, 500));
  }

  let url = await Url.findOne({ sortUrl: sortUrl }).select(
    "+lastAccessedAt +country +device"
  );

  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  console.log(userInfo);

  url.country.set(
    userInfo.country,
    (url.country.get(userInfo.country) || 0) + 1
  );
  url.device.set(
    userInfo.deviceType,
    (url.device.get(userInfo.deviceType) || 0) + 1
  );

  url.lastAccessedAt = new Date();

  url.locations.push({
    type: "Point",
    coordinates: userInfo.coordinates,
  });

  await url.save({ validateBeforeSave: false, timestamps: false });

  res.redirect(url.longUrl);
});

urlCtrl.getUrl = catchAsync(async (req, res, next) => {
  const urlId = req.params.id;
  const url = await Url.findById(urlId).select(
    "+device +country +lastAccessedAt"
  );
  if (!url) {
   return next(new AppError("url is not found", 404 ));
  }
  res.json({ data: url });
});

urlCtrl.getUserUrls = catchAsync(async (req, res, next) => {
  const userUrls = await Url.find({ user: req.user._id }).select("-locations");

  res.status(200).json({ urls: userUrls });
});

urlCtrl.editUrl = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { sortUrl } = req.body;
  const alreadyExist = await Url.findOne({ sortUrl: sortUrl });
  if (alreadyExist) {
    return next(new AppError("url is already exist try somethig unique", 400));
  }
  const updatedUrl = await Url.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedUrl) {
    return next(new AppError("invalid id or url not found", 400));
  }
  res.status(200).json({ message: "updated successfully", data: updatedUrl });
});

urlCtrl.delete = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deleted = await Url.findByIdAndDelete(id, { new: true });
  if (!deleted) {
    return next(new AppError("deletion was failed", 400));
  }
  res.status(200).json({ message: "successfully deleted", data: deleted });
});

export default urlCtrl;
