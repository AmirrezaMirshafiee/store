import Product from "../Product/productMd.js";
import Category from "./categoryMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
import fs from "fs";
import { __direname } from "../../app.js";
export const create = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  return res.status(201).json({
    success: true,
    message: "create category successfully",
    data: category,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? {}
        : { isPublished: true },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate({ path: "subCategoryId" })
    .search(["title"]);
  const result = await features.execute();
  return res.status(201).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
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
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "update category successfully",
    data: category,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const products = await Product.findById({ categoryId: req.params.id });
  const subCategory = await Category.findById({ subCategoryId: req.params.id });
  if (products.length > 0 || subCategory.length > 0) {
    return next(new HandleERROR("you can't remove", 400));
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (fs.existsSync(`${__direname}/Public/${category?.image}`)) {
    fs.unlinkSync(`${__direname}/Public/${category?.image}`);
  }
  return res.status(201).json({
    success: true,
    message: "deleted category successfully",
  });
});
