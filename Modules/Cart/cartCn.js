import Product from "../Product/productMd.js";
import ProductVariant from "../ProductVariant/productVariantMd.js";
import Cart from "./cartMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Cart, req.query, req.role)
    .addManualFilters({
      userId: req.userId,
    })
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({
      path: "items",
      populate: [
        { path: "productId", select: "name price" },
        { path: "productVariantId", select: "variantId priceAfterDiscount" },
        { path: "categoryId", select: "name" },
        { path: "brandId", select: "name" },
      ],
    });
  const result = await features.execute();
  let newTotalPrice = 0;
  let newTotalPriceAfterDiscount = 0;
  let change = false;
  let cart = result?.data?.[0];
  let newCart = cart;
  newCart.items = newCart?.items.filter((item) => {
    item.categoryId == item.categoryId?._id?.toString();
    item.brandId == item.brandId?._id?.toString();
    if (item?.quantity > item?.productVariantId?.quantity) {
      change = true;
      item.quantity = item?.productVariantId?.quantity;
      if (item?.quantity == 0) {
        return false;
      }
    }
    newTotalPrice += item?.quantity * item?.productVariantId?.price;
    newTotalPriceAfterDiscount +=
      item?.quantity * item?.productVariantId?.priceAfterDiscount;
    item.productId = item?.productId?._id?.toString();
    item.productVariantId = item?.productVariantId?._id?.toString();
    return item;
  });
  if (
    newCart?.totalPrice != newTotalPrice ||
    newCart?.totalPriceAfterDiscount != newTotalPriceAfterDiscount
  ) {
    change = true;
    newCart.totalPrice = newTotalPrice;
    newCart.totalPriceAfterDiscount = newTotalPriceAfterDiscount;
  }
  let cartResult;
  if (change) {
    cartResult = await Cart.findByIdAndUpdate(cart?._id, newCart, {
      new: true,
      runValidators: true,
    }).populate({
      path: "items",
      populate: [
        { path: "productId", select: "name price" },
        { path: "productVariantId", select: "variantId priceAfterDiscount" },
        { path: "categoryId", select: "name" },
        { path: "brandId", select: "name" },
      ],
    });
  } else {
    cartResult = cart;
  }
  res.status(200).json({
    success: true,
    data: cartResult,
    message: "cart fetched successfully",
  });
});
export const addItem = catchAsync(async (req, res, next) => {
  const { productId, productVariantId } = req.body;
  let pr = await Product.findById(productId);
  let prv = await ProductVariant.findById(productVariantId);
  if (prv.quantity == 0) {
    return next(new HandleERROR("productVariant is out of stock", 400));
  }
  let cart = await Cart.findOne({ userId: req.userId });
  let add = false;
  cart.items = cart.items.map((item) => {
    if (item.productVariantId.toString() == productVariantId.toString()) {
      item.quantity++;
      add = true;
      if (item.quantity > prv.quantity) {
        return next(
          new HandleERROR("productVariant quantity is not enough", 400),
        );
      }
    }
    return item;
  });
  if (!add) {
    cart.items.push({
      productId,
      productVariantId,
      categoryId: pr.categoryId,
      brandId: pr.brandId,
      quantity: 1,
    });
  }
  cart.totalPrice += prv.price;
  cart.totalPriceAfterDiscount += prv.priceAfterDiscount;
  await cart.save();
  let newCart = await Cart.findByIdAndUpdate(cart?._id, cart, {
    new: true,
    runValidators: true,
  }).populate({
    path: "items",
    populate: [
      { path: "productId", select: "name price" },
      { path: "productVariantId", select: "variantId priceAfterDiscount" },
      { path: "categoryId", select: "name" },
      { path: "brandId", select: "name" },
    ],
  });
  res.status(200).json({
    success: true,
    data: newCart,
    message: "item added to cart successfully",
  });
});
export const removeItem = catchAsync(async (req, res, next) => {
  const { productVariantId } = req.body;
  let prv = await ProductVariant.findById(productVariantId);
  let cart = await Cart.findOne({ userId: req.userId });
  cart.items = cart.items.filter((item) => {
    if (item.productVariantId.toString() == productVariantId.toString()) {
      item.quantity--;
      if (item.quantity == 0) {
        return false;
      }
    }
    return true;
  });
  cart.totalPrice -= prv.price;
  cart.totalPriceAfterDiscount -= prv.priceAfterDiscount;
  await cart.save();
  let newCart = await Cart.findByIdAndUpdate(cart?._id, cart, {
    new: true,
    runValidators: true,
  }).populate({
    path: "items",
    populate: [
      { path: "productId", select: "name price" },
      { path: "productVariantId", select: "variantId priceAfterDiscount" },
      { path: "categoryId", select: "name" },
      { path: "brandId", select: "name" },
    ],
  });
  res.status(200).json({
    success: true,
    data: newCart,
    message: "item removed from cart successfully",
  });
});
