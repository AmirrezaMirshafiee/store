import { Router } from "express";
import { changePassword, getAll, getOne, update } from "./userCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import {
  changePasswordValidator,
  getAllUserValidator,
  updateUserValidator,
  userIdParam,
} from "./UserValidator.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import isLogin from "../../Middlewares/isLogin.js";
const userRouter = Router();

userRouter
  .route("/")
  .get(isAdmin, getAllUserValidator, handleValidationErrors, getAll);
userRouter
  .route("/change")
  .patch(
    isLogin,
    changePasswordValidator,
    handleValidationErrors,
    changePassword,
  );
userRouter
  .route("/:id")
  .get(isLogin, userIdParam, handleValidationErrors, getOne)
  .patch(isLogin, updateUserValidator, handleValidationErrors, update);
export default userRouter;
