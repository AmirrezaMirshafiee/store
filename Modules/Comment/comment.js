import { Router } from "express";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import isLogin from "../../Middlewares/isLogin.js";
import {
  changePublishCommentValidator,
  createCommentValidator,
  deleteCommentValidator,
  getAllCommentValidator,
  getProductCommentsValidator,
  productIdParam,
  replyCommentValidator
} from "./commentValidator.js";
import {
  changePublish,
  create,
  getAll,
  getProduct,
  remove,
  reply,
} from "./commentCn.js";

const commentRouter = Router();
commentRouter
  .route("/")
  .get(isAdmin, getAllCommentValidator, handleValidationErrors, getAll)
  .post(isLogin, createCommentValidator, handleValidationErrors, create);
commentRouter
  .route("/:id")
  .get(
    isLogin,
    productIdParam,
    getProductCommentsValidator,
    handleValidationErrors,
    getProduct,
  )
  .patch(
    isAdmin,
    changePublishCommentValidator,
    handleValidationErrors,
    changePublish,
  )
  .delete(isAdmin, deleteCommentValidator, handleValidationErrors, remove);

commentRouter
  .route("/reply/:id")
  .post(isLogin,replyCommentValidator, handleValidationErrors, reply);
export default commentRouter;
