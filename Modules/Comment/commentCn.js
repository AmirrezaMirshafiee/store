// import Product from "../Product/productMd.js";
import Comment from "./commentMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "superAdmin"
        ? {}
        : { isPublished: true },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "name email" },
      { path: "productId", select: "name price" },
    ]);
  const comments = await features.execute();
  res.status(200).json(comments);
});
export const getProduct = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "superAdmin"
        ? { productId: req.params.id }
        : { $and: [{ productId: req.params.id }, { isPublished: true }] },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "name email" },
      { path: "productId", select: "name price" },
    ]);
  const comments = await features.execute();
  res.status(200).json(comments);
});
export const create = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  let isBought = user?.boughtProductId?.find((item) =>
    item.toString() === req.body.productId.toString() ? true : false,
  );
  const comment = await Comment.create({
    ...req.body,
    userId: req.userId,
    isReply: false,
    isBought,
  });
  if (req?.body?.rate && isBought) {
    const product = await Product.findById(req.body.productId);
    product.avgRate =
      (product.avgRate * product.ratingCount + req.body.rate) /
      (product.ratingCount + 1);
    product.ratingCount++;

    await product.save();
  }
  res.status(201).json({
    success: true,
    data: comment,
    message: "comment created successfully",
  });
});
export const changePublish = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new HandleERROR("comment not found", 404));
  }
  comment.isPublished = !comment.isPublished;
  await comment.save();
  res.status(200).json({
    success: true,
    data: comment,
    message: "comment publish status changed successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ replyTo: req.params.id });
  if (!comment) {
    return next(new HandleERROR("comment not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "comment deleted successfully",
  });
});
export const reply = catchAsync(async (req, res, next) => {
  const parentComment = await Comment.findById(req.params.id);
  if (!parentComment) {
    return next(new HandleERROR("comment not found", 404));
  }

  const comment = await Comment.create({
    content: req.body.content,
    productId: parentComment.productId,
    userId: req.userId,
    isReply: true,
    replyTo: req.params.id,
    isBought: false,
    rate: undefined,
  });

  res.status(201).json({
    success: true,
    message: "reply created successfully",
    data: comment,
  });
});

