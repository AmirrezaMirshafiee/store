import Product from "../Product/productMd.js";
import Brand from "./brandMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
import fs from "fs";
import { __direname } from "../../app.js";
export const create = catchAsync(async (req, res, next) => {
  const brand = await Brand.create(req.body);
  return res.status(201).json({
    success: true,
    message: "create brand successfully",
    data: brand,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Brand, req.query, req.role)
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
  const features = new ApiFeatures(Brand, req.query, req.role)
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
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "update brand successfully",
    data: brand,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const products = await Product.findById({ bradId: req.params.id });
  if (products.length > 0) {
    return next(new HandleERROR("you can't remove", 400));
  }
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (fs.existsSync(`${__direname}/Public/${brand?.image}`)) {
    fs.unlinkSync(`${__direname}/Public/${brand?.image}`);
  }
  return res.status(201).json({
    success: true,
    message: "deleted brand successfully",
  });
});
