import { Router } from "express";

import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getAllCategoryValidator,
  getOneCategoryValidator,
  updateCategoryValidator,
} from "./categoryValidator.js";
import { create, getAll, getOne, remove, update } from "./categoryCn.js";
const categoryRouter = Router();
categoryRouter
  .route("/")
  .get(getAllCategoryValidator, handleValidationErrors, getAll)
  .post(isAdmin, createCategoryValidator, handleValidationErrors, create);
categoryRouter
  .route("/:id")
  .get(getOneCategoryValidator, handleValidationErrors, getOne)
  .patch(isAdmin, updateCategoryValidator, handleValidationErrors, update)
  .delete(isAdmin, deleteCategoryValidator, handleValidationErrors, remove);

export default categoryRouter;
