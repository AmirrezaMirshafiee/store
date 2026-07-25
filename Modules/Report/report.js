import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import { dashboardReport } from "./reportCn.js";
const reportRouter = Router();
reportRouter.route("/").get(isAdmin, dashboardReport);
export default reportRouter;
