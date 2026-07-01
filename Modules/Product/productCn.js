import Product from "../Product/productMd.js";
import User from "../User/userMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
import fs from "fs";
import { __direname } from "../../app.js";
export const create = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    message: "create product successfully",
    data: product,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Product, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? {}
        : { isPublished: true },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate([
      { path: "brandId" },
      { path: "categoryId" },
      { path: "defaultProductVariant" },
      { path: "productVariants" },
    ])
    .search(["title"]);
  const result = await features.execute();
  return res.status(201).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Product, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ isPublished: true }, { _id: req.params.id }] },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate([
      { path: "brandId" },
      { path: "categoryId" },
      { path: "defaultProductVariant" },
      { path: "productVariants" },
    ])
    .search(["title"]);
  const result = await features.execute();
  let isFavorite = false;
  let isRated = false;
  let isBought = false;
  if (req?.userId) {
    let user = await User.findById(req?.userId);
    isFavorite = user?.favoriteProductId?.find(
      (item) => item?.toString() === req.params.id,
    )
      ? true
      : false;
    isRated = user?.ratedProductId?.find(
      (item) => item?.toString() === req.params.id,
    )
      ? true
      : false;
    isBought = user?.boughtProductId?.find(
      (item) => item?.toString() === req.params.id,
    )
      ? true
      : false;
  }
  return res.status(201).json({ ...result, isRated, isBought, isFavorite });
});
export const update = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "update product successfully",
    data: product,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const products = await Product.findById(req.params.id);
  if (products?.boughtCount > 0) {
    return next(new HandleERROR("you can't remove", 400));
  }
  await Product.findByIdAndDelete(req.params.id);
  for (let img of products?.images) {
    if (fs.existsSync(`${__direname}/Public/${img}`)) {
      fs.unlinkSync(`${__direname}/Public/${img}`);
    }
  }
  // comment
  return res.status(201).json({
    success: true,
    message: "deleted product successfully",
  });
});
export const favorite = catchAsync(async (req, res, next) => {
  const user = await User.findById(req?.userId);
  let isFav = user?.favoriteProductId?.find((item) =>
    item?.toString() == req?.params?.id?.toString() ? true : false,
  );
  if (isFav) {
    user.favoriteProductId = user.favoriteProductId?.filter(
      (item) => item?.toString() != req?.params?.id?.toString(),
    );
  } else {
    user.favoriteProductId.push(req.params.id);
  }
  await user.save();
  return res.status(201).json({
    success: true,
    data: isFav,
    message: isFav ? "deleted product is favorite" : "add product is favorite",
  });
});
