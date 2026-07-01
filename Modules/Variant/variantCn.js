import Variant from "./variantMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
import fs from "fs";
import { __direname } from "../../app.js";
import ProductVariant from "../ProductVariant/productVariantMd.js";
export const create = catchAsync(async (req, res, next) => {
  const variant = await Variant.create(req.body);
  return res.status(201).json({
    success: true,
    message: "create variant successfully",
    data: variant,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Variant, req.query, req.role)
    .addManualFilters()
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate()
    .search(["type", "value"]);
  const result = await features.execute();
  return res.status(201).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Variant, req.query, req.role)
    .addManualFilters()
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate()
    .search(["type", "value"]);
  const result = await features.execute();
  return res.status(201).json(result);
});
export const update = catchAsync(async (req, res, next) => {
  const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "update variant successfully",
    data: variant,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.find({
    variantId: req.params.id,
  });
  if (productVariant.length > 0) {
    return next(new HandleERROR("you can't remove", 400));
  }
  const variant = await Variant.findByIdAndDelete(req.params.id);

  return res.status(201).json({
    success: true,
    message: "deleted variant successfully",
  });
});
