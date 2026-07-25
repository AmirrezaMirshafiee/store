import express from "express";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { catchError } from "vanta-api";
import swaggerUi from "swagger-ui-express";
import { exportValidationData } from "./Middlewares/ExportValidation.js";
import cron from "node-cron";
import {
  addressRouter,
  authRouter,
  brandRouter,
  cartRouter,
  categoryRouter,
  commentRouter,
  discountCodeRouter,
  orderRouter,
  productRouter,
  productVariantRouter,
  reportRouter,
  searchRouter,
  sliderRouter,
  uploadRouter,
  userRouter,
  variantRouter,
} from "./Modules/index.js";
import rateLimit from "express-rate-limit";
import { swaggerSpec } from "./Utils/Swagger.js";
import { cronJobPayment } from "./Modules/Order/ordenCn.js";
import isLogin from "./Middlewares/isLogin.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __direname = path.dirname(__filename);
const limit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: "ip blocked",
});
cron.schedule("* 10 * * * * ", cronJobPayment);
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/upload", express.static(`${__direname}/Public`));
app.use(exportValidationData);
app.use(limit);
app.use('/api/users',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/brands',brandRouter)
app.use('/api/variants',variantRouter)
app.use('/api/categories',categoryRouter)
app.use('/api/products',productRouter)
app.use('/api/upload',uploadRouter)
app.use('/api/comments',commentRouter)
app.use('/api/orders',orderRouter)
app.use('/api/addresses',isLogin,addressRouter)
app.use('/api/product-variants',productVariantRouter)
app.use('/api/sliders',sliderRouter)
app.use('/api/cart',isLogin,cartRouter)
app.use('/api/discount-code',discountCodeRouter)
app.use('/api/search',searchRouter)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "not found route",
  });
});
app.use(catchError);
export default app;
