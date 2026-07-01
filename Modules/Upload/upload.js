import { Router } from "express";
import { deleteFile, uploadCn, uploadMulti } from "./uploadCn.js";
import upload from "../../Utils/uploadFile.js";
import isAdmin from "../../Middlewares/isAdmin.js";
const uploadRouter = Router();
uploadRouter
  .route("/")
  .post(isAdmin,upload.single("file"), uploadCn)
  .delete(isAdmin,deleteFile);
uploadRouter.route("/multi").post(isAdmin,upload.array("files", 5), uploadMulti);
export default uploadRouter;
