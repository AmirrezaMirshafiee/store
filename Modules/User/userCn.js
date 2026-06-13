import User from "./userMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";

export const getAll = catchAsync(async (req, res, next) => {
  const { search = null } = req.query;
  const features = new ApiFeatures(User, req.query, req.role)
    .addManualFilters(
      search
        ? {
            phoneNumber: {
              $regex: search,
              $option: "i",
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
  const { id } = req.params;
  const { isActive = false, fullName = null, role = null } = req.body;
  if (req?.role ==="admin" &&id?.toString() != req?.userId?.toString() &&(req.role === "admin" || req.role === "superAdmin")
  ) {
    return next(
      new HandleERROR("you don't have permission to update account", 400),
    );
  }
  const user = await User.findById(id);
  if (req.role === "admin" || req.role === "superAdmin") {
    user.isActive = isActive || user.isActive;
    user.role = role || user.role;
  }
  user.fullName=fullName ||user.fullName
  const newUser= await user.save()
  return res.status(201).json({
    status:true,
    data:newUser
  })
});
