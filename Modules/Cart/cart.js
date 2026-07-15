import { Router } from "express";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import { addItem, getOne, removeItem } from "./cartCn.js";
import {
  addItemValidator,
  getCartValidator,
  removeItemValidator,
} from "./cartValidator.js";
const cartRouter = Router();
cartRouter.route("/").get(getCartValidator, handleValidationErrors, getOne);
cartRouter
  .route("/add")
  .post(addItemValidator, handleValidationErrors, addItem);
cartRouter
  .route("/remove")
  .post(removeItemValidator, handleValidationErrors, removeItem);
export default cartRouter;
