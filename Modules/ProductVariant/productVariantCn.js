import Product from "../Product/productMd.js";
import ProductVariant from "./productVariantMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
import fs from "fs";
import { __direname } from "../../app.js";
export const create = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.create(req.body);
  const product = await Product(productVariant?.productId);
  if (!product?.defaultProductVariant) {
    product.defaultProductVariant = productVariant?._id;
  }
  product?.productVariants.push(productVariant?._id);
  await product.save();
  return res.status(201).json({
    success: true,
    message: "create productVariant successfully",
    data: productVariant,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(ProductVariant, req.query, req.role)
    .addManualFilters()
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate([{ path: "brandId" }, { path: "productId" }])
    .search();
  const result = await features.execute();
  return res.status(201).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(ProductVariant, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ isPublished: true }, { _id: req.params.id }] },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate([{ path: "brandId" }, { path: "productId" }])
    .search();
  const result = await features.execute();

  return res.status(201).json(result);
});
export const update = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true,
    },
  );
  return res.status(201).json({
    success: true,
    message: "update productVariant successfully",
    data: productVariant,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const productVariant = await ProductVariant.findById(id);
  if (productVariant?.boughtCount > 0) {
    return next(new HandleERROR("you can't remove", 400));
  }
  await ProductVariant.findByIdAndDelete(id);
  let product = await Product.findById(productVariant?.productId);
  product.productVariants = product?.productVariants?.filter(
    (item) => item?.id?.toString() != id?.toString(),
  );
  if (product?.defaultProductVariant.toString() == id?.toString()) {
    product.defaultProductVariant =
      product?.productVariants?.length > 0
        ? product?.productVariants?.at(-1)
        : null;
  }
  await product.save();
  return res.status(201).json({
    success: true,
    message: "deleted productVariant successfully",
  });
});
