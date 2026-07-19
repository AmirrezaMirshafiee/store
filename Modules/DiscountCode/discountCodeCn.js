import Cart from "../Cart/cartMd.js";
import DiscountCode from "./discountCodeMd.js";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(DiscountCode, req.query, req.role)
    .addManualFilters()
    .limitFields()
    .paginate()
    .filter()
    .sort()
    .search()
    .populate({ path: "usedUserId" });
  const result = await features.execute();
  return res.status(200).json(result);
});
// discount?populate=
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const features = new ApiFeatures(DiscountCode, req.query, req.role)
    .addManualFilters({ _id: id })
    .limitFields()
    .paginate()
    .filter()
    .sort()
    .search()
    .populate({ path: "usedUserId" });
  const result = await features.execute();
  return res.status(200).json(result);
});
export const create = catchAsync(async (req, res, next) => {
  const discount = await DiscountCode.create(req.body);
  return res.status(201).json({
    success: true,
    message: "discount code create successfully",
    data: discount,
  });
});
export const update = catchAsync(async (req, res, next) => {
  let discountCode = await DiscountCode.findByIdAndUpdate(
    req.params,
    req.body,
    { new: true, runValidators: true },
  );
  return res.status(200).json({
    success: true,
    message: "discount code update successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  let discountCode = await DiscountCode.findById(req.params);
  if (discountCode.usedUserId.length > 0) {
    return next(new HandleERROR("you can not remove discount code", 400));
  }
  await DiscountCode.findByIdAndDelete(req.params);
  return res.status(200).json({
    success: true,
    message: "discount code remove successfully",
  });
});
export const validateCode = (userId, discountCode, finalPrice) => {
  const errors = [];
  const now = new Date();

  if (!discountCode) {
    errors.push("Discount code not found.");
  }

  const usedUserCount =
    discountCode?.usedUserId?.filter(
      (item) => item?.toString() === userId?.toString(),
    )?.length || 0;

  if (!discountCode.isActive) {
    errors.push("Discount code is inactive.");
  }

  if (
    typeof discountCode.minPrice === "number" &&
    finalPrice < discountCode.minPrice
  ) {
    errors.push(
      `Order total must be at least ${discountCode.minPrice} to use this discount code.`,
    );
  }

  if (
    typeof discountCode.maxPrice === "number" &&
    finalPrice > discountCode.maxPrice
  ) {
    errors.push(
      `Order total must not exceed ${discountCode.maxPrice} to use this discount code.`,
    );
  }

  if (
    typeof discountCode.maxUsedUser === "number" &&
    usedUserCount >= discountCode.maxUsedUser
  ) {
    errors.push("You have reached the usage limit for this discount code.");
  }

  if (discountCode.startDate && now < new Date(discountCode.startDate)) {
    errors.push("This discount code is not available yet.");
  }

  if (discountCode.endDate && now > new Date(discountCode.endDate)) {
    errors.push("This discount code has expired.");
  }

  return {
    success: errors.length === 0 ? true : false,
    message: errors[0] || "Discount code is valid.",
    errors,
  };
};

export const checkCode = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const { userId } = req;

  // 1. Find Discount and Cart
  const discountCode = await DiscountCode.findOne({ code });
  const cart = await Cart.findOne({ userId });

  // 2. Handle missing entities
  if (!discountCode) {
    return next(new HandleERROR("Discount code not found", 404));
  }
  if (!cart) {
    return next(new HandleERROR("Cart not found", 404));
  }

  // 3. Validate code logic
  const validation = validateCode(
    userId,
    discountCode,
    cart.totalPriceAfterDiscount,
  );

  if (!validation.success) {
    return res.status(400).json({ 
      success: false, 
      message: validation.errors[0], // Return the first error for clarity
      errors: validation.errors 
    });
  }

  // 4. Calculate Final Price
  let finalPrice = cart.totalPriceAfterDiscount;
  let discountAmount = 0;

  if (discountCode.type === "amount") {
    // Assuming value is a number string, parse it
    discountAmount = parseFloat(discountCode.value);
    finalPrice -= discountAmount;
  } else if (discountCode.type === "percent") {
    const percent = parseFloat(discountCode.value);
    discountAmount = (finalPrice * percent) / 100;
    finalPrice -= discountAmount;
  }
  // If freeDelivery is true, finalPrice remains the same, 
  // but you usually flag this to the frontend

  // Ensure final price doesn't go below 0
  finalPrice = Math.max(0, finalPrice);

  return res.status(200).json({
    success: true,
    message: "Discount applied successfully",
    data: {
      originalPrice: cart.totalPriceAfterDiscount,
      discountAmount,
      finalPrice,
      isFreeDelivery: discountCode.freeDelivery || discountCode.type === "freeDelivery"
    }
  });
});

