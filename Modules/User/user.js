import { Router } from "express";
import { getAll, getOne, update } from "./userCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import { getAllUserValidator, updateUserValidator } from "./UserValidator.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import isLogin from "../../Middlewares/isLogin.js";
const userRouter = Router();

userRouter
  .route("/")
  .get(isAdmin, getAllUserValidator, handleValidationErrors, getAll);
userRouter
  .route("/:id")
  .get(isLogin, getOne)
  .patch(isLogin, updateUserValidator, handleValidationErrors, update);
export default userRouter;
