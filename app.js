import express from "express";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { catchError } from "vanta-api";
import { exportValidationData } from "./Middlewares/ExportValidation.js";
import { uploadRouter, userRouter } from "./Modules/index.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __direname = path.dirname(__filename);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/upload",express.static(`${__direname}/Public`));
app.use(exportValidationData);

app.use("api/upload",uploadRouter)
app.use("api/users",userRouter)
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "not found route",
  });
});
app.use(catchError);
export default app;
