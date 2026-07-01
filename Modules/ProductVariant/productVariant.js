import { Router } from "express";

import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import isAdmin from "../../Middlewares/isAdmin.js";

import isLogin from "../../Middlewares/isLogin.js";
import { createProductVariantValidator, getAllProductVariantValidator, productVariantIdParam, updateProductVariantValidator } from "./ProductVariantValidator.js";
import { create, getAll, getOne, remove, update } from "./productVariantCn.js";
const productVariantRouter = Router();
productVariantRouter
  .route("/")
  .get(getAllProductVariantValidator, handleValidationErrors, getAll)
  .post(isAdmin, createProductVariantValidator, handleValidationErrors, create);
productVariantRouter
  .route("/:id")
  .get(productVariantIdParam, handleValidationErrors, getOne)
  .patch(isAdmin,productVariantIdParam, updateProductVariantValidator, handleValidationErrors, update)
  .delete(isAdmin, productVariantIdParam, handleValidationErrors, remove);


export default productVariantRouter;
