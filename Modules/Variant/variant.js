import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import { create, getAll, getOne, remove, update } from "./variantCn.js";
import {
  createVariantValidator,
  getAllVariantValidator,
  updateVariantValidator,
  variantIdParam,
} from "./variantValidator.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

const variantRouter = Router();
variantRouter
  .route("/")
  .get(getAllVariantValidator, handleValidationErrors, getAll)
  .post(isAdmin, createVariantValidator, handleValidationErrors, create);
variantRouter
  .route("/:id")
  .get(variantIdParam, handleValidationErrors, getOne)
  .patch(isAdmin, updateVariantValidator, handleValidationErrors, update)
  .delete(isAdmin, remove);

export default variantRouter;
