import { Router } from "express";
import {
  auth,
  forgetPassword,
  loginWithOtp,
  loginWithPassword,
  resendCode,
} from "./authCn.js";
import {
  authValidator,
  forgetPasswordValidator,
  loginWithOtpValidator,
  loginWithPasswordValidator,
  resendCodeValidator,
} from "./AuthValidator.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
const authRouter = Router();

authRouter.route("/").post(authValidator, handleValidationErrors, auth);
authRouter
  .route("/login-password")
  .post(loginWithPasswordValidator, handleValidationErrors, loginWithPassword);
authRouter
  .route("/login-otp")
  .post(loginWithOtpValidator, handleValidationErrors, loginWithOtp);
authRouter
  .route("/resend-code")
  .post(resendCodeValidator, handleValidationErrors, resendCode);
authRouter
  .route("/forget-password")
  .post(forgetPasswordValidator, handleValidationErrors, forgetPassword);



export default authRouter