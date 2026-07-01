import Address from "./addressMd.js";
import ApiFeatures, { HandleERROR, catchAsync } from "vanta-api";
import { __direname } from "../../app.js";
export const create = catchAsync(async (req, res, next) => {
  const address = await Address.create(req.body);
  return res.status(201).json({
    success: true,
    message: "create address successfully",
    data: address,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Address, req.query, req.role)
    .addManualFilters()
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate()
    .search();
  const result = await features.execute();
  return res.status(201).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Address, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? { _id: req.params.id }
        : { _id: req.params.id },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate([{ path: "userId" }])
    .search();
  const result = await features.execute();
  return res.status(201).json(result);
});
export const update = catchAsync(async (req, res, next) => {
  const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "update address successfully",
    data: address,
  });
});
export const remove = catchAsync(async (req, res, next) => {});
