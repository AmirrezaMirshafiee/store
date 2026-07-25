import { Router } from "express";
import { search } from "./searchCn.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import { searchValidator } from "./searchValidator.js";

const searchRouter = Router();
searchRouter.route("/").get(searchValidator, handleValidationErrors, search);
export default searchRouter;
