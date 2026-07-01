import { Router } from "express";

import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import {
  createProductValidator,
  getAllProductValidator,
  productIdParam,
  updateProductValidator,
} from "./ProductValidator.js";
import {
  create,
  favorite,
  getAll,
  getOne,
  remove,
  update,
} from "./productCn.js";
import isLogin from "../../Middlewares/isLogin.js";
const productRouter = Router();
productRouter
  .route("/")
  .get(getAllProductValidator, handleValidationErrors, getAll)
  .post(isAdmin, createProductValidator, handleValidationErrors, create);
productRouter
  .route("/:id")
  .get(productIdParam, handleValidationErrors, getOne)
  .patch(isAdmin, updateProductValidator, handleValidationErrors, update)
  .delete(isAdmin, productIdParam, handleValidationErrors, remove);
productRouter
  .route("/fav/:id")
  .post(isLogin, productIdParam, handleValidationErrors, favorite);

export default productRouter;
