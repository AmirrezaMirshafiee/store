import { catchAsync, HandleERROR } from "vanta-api";

const isAdmin = catchAsync(async (req, res, next) => {
  console.log(req);
  if (req.role !== "admin" && req.role !== "superAdmin") {
    return next(new HandleERROR("you don't have permission"), 401);
  }
  return next();
});

export default isAdmin;
