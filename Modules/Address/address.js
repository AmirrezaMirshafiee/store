import { Router } from "express";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import isLogin from "../../Middlewares/isLogin.js";
import {
  addressIdParam,
  createAddressValidator,
  deleteAddressValidator,
  getAllAddressValidator,
  updateAddressValidator,
} from "./addressValidator.js";
import { create, getAll, getOne, remove, update } from "./addressCn.js";
const addressRouter = Router();
addressRouter
  .route("/")
  .get(isLogin, getAllAddressValidator, handleValidationErrors, getAll)
  .post(isLogin, createAddressValidator, handleValidationErrors, create);
addressRouter
  .route("/:id")
  .get(isLogin, addressIdParam, handleValidationErrors, getOne)
  .patch(isLogin, updateAddressValidator, handleValidationErrors, update)
  .delete(isLogin, deleteAddressValidator, handleValidationErrors, remove);

export default addressRouter;
