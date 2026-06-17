import User from "./userMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
import bcryptjs from "bcryptjs";
export const getAll = catchAsync(async (req, res, next) => {
  const { search = null } = req.query;
  const features = new ApiFeatures(User, req.query, req.role)
    .addManualFilters(
      search
        ? {
            phoneNumber: {
              $regex: search,
              $options: "i",
            },
          }
        : {},
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate([
      { path: "boughtProductId" },
      { path: "favoriteProductId" },
      { path: "ratedProductId" },
      { path: "addressId" },
      { path: "cartId" },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req.query, req.role)

    .addManualFilters(
      req.role === "user" ? { _id: req.userId } : { _id: req.params.id },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate([
      { path: "boughtProductId" },
      { path: "favoriteProductId" },
      { path: "ratedProductId" },
      { path: "addressId" },
      { path: "cartId" },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const update = catchAsync(async (req, res, next) => {
  const { isActive = "null", role = null, fullName = null } = req.body;
  const { id } = req.params;
  if (req.role == "user" && id.toString() != req.userId.toString()) {
    return next(new HandleERROR("you permission for update this account", 403));
  }
  const user = await User.findById(id);
  if (
    req.role == "admin" &&
    id.toString() != req.userId.toString() &&
    (user.role == "admin" || user.role == "superAdmin")
  ) {
    return next(new HandleERROR("you permission for update this account", 403));
  }
  if (req.role != "user") {
    user.isActive = isActive == "null" ? user.isActive : isActive;
  }
  if (req.role == "superAdmin") {
    user.role = role || user?.role;
  }
  user.fullName = fullName || user?.fullName;
  const newUser = await user.save();
  return res.status(200).json({
    success: true,
    message: "user Updated successfully",
    data: newUser,
  });
});
export const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.userId);
  if (!user) {
    return next(new HandleERROR("user not found", 404));
  }
  if (!user.password) {
    user.password = bcryptjs.hashSync(newPassword, 10);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "password set successfully",
    });
  }
  if (!oldPassword.trim() || !newPassword.trim()) {
    return next(
      new HandleERROR("oldPassword  and newPassword is required", 404),
    );
  }
  const isMatch = bcryptjs.compareSync(oldPassword, user.password);
  if (!isMatch) {
    return next(new HandleERROR("old password not valid", 404));
  }
  user.password = bcryptjs.hashSync(newPassword, 10);
  return res.status(200).json({
    success: true,
    message: "updated password  successfully",
  });
});
