import Slider from "./sliderMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
import fs from "fs";
import { __direname } from "../../app.js";
export const create = catchAsync(async (req, res, next) => {
  const slider = await Slider.create(req.body);
  return res.status(201).json({
    success: true,
    message: "create slider successfully",
    data: slider,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Slider, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? {}
        : { isPublished: true },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate()
    .search(["title"]);
  const result = await features.execute();
  return res.status(201).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Slider, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ isPublished: true }, { _id: req.params.id }] },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate()
    .search(["title"]);
  const result = await features.execute();
  return res.status(201).json(result);
});
export const update = catchAsync(async (req, res, next) => {
  const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "update slider successfully",
    data: slider,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const slider = await Slider.findByIdAndDelete(req.params.id);
  if (fs.existsSync(`${__direname}/Public/${slider?.image}`)) {
    fs.unlinkSync(`${__direname}/Public/${slider?.image}`);
  }
  return res.status(201).json({
    success: true,
    message: "deleted brand successfully",
    data: slider,
  });
});
