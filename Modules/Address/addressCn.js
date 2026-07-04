import User from "../User/userMd.js";
import Address from "./addressMd.js";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";

export const create = catchAsync(async (req, res, next) => {
  const address = await Address.create({ ...req.body, userId: req.userId });
  await User.findByIdAndUpdate(req.userId, {
    $push: { addressId: address._id },
  });
  return res.status(201).json({
    success: true,
    message: "Address created successfully",
    data: address,
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Address, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? {}
        : { userId: req.userId },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([{ path: "userId", select: "fullName phoneNumber" }])
    .search(["province", "city", "title", "address", "NO", "floor"]);

  const address = await features.execute();
  return res.status(200).json(address);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Address, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ userId: req.userId }, { _id: req.params.id }] },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([{ path: "userId", select: "fullName phoneNumber" }])
    .search(["province", "city", "title", "address", "NO", "floor"]);

  const address = await features.execute();
  return res.status(200).json({
    status: true,
    message: "Address fetched successfully",
    data: address,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { userId = null, ...othersData } = req.body;
  const address = await Address.findById(req.params.id);
  if (
    address?.userId?.toString() !== req.userId?.toString() &&
    req.role !== "admin" &&
    req.role !== "superAdmin"
  ) {
    return next(
      new HandleERROR("You are not authorized to update this address", 403),
    );
  }
  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    othersData,
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: updatedAddress,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);
  if (
    address?.userId?.toString() !== req.userId?.toString() &&
    req.role !== "admin" &&
    req.role !== "superAdmin"
  ) {
    return next(
      new HandleERROR("You are not authorized to delete this address", 403),
    );
  }
  await Address.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(address.userId, {
    $pull: { addressId: req.params.id },
  });
  return res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});
