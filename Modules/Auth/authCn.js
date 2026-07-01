import User from "../User/userMd.js";
import { sendAuthCode, verifyCode } from "../../Utils/smsHandler.js";
import { catchAsync, HandleERROR } from "vanta-api";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Cart from "../Cart/cartMd.js";
export const auth = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const user = await User.findOne({ phoneNumber });
  console.log(user);
  if (!user || !user?.password) {
    const resultSms = await sendAuthCode(phoneNumber);
    if (!resultSms) {
      return res.status(500).json({
        status: false,
        message: resultSms.message,
      });
    }
  }
  return res.status(200).json({
    status: true,
    message: !user || !user?.password ? "OTP Code sent" : "login with password",
    data: {
      userExist: user ? true : false,
      userPassword: user?.password ? true : false,
    },
  });
});
export const loginWithPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  //  complete populate  cartId
  const user = await User.findOne({ phoneNumber }).populate("cartId");
  if (!user || !user.password) {
    return next(new HandleERROR("phoneNumber or password in valid", 404));
  }
  const isMatch = bcryptjs.compareSync(password, user.password);
  if (!isMatch) {
    return next(new HandleERROR("phoneNumber or password in valid", 404));
  }
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );
  return res.status(200).json({
    status: true,
    message: "login successfully",
    data: {
      token,
      user: {
        _id: user._id,
        role: user.role,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        cartId: user.cartId,
      },
    },
  });
});
export const loginWithOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber, code } = req.body;
  const verify = await verifyCode(phoneNumber, code);
  if (!verify) {
    return next(new HandleERROR("in valid code", 404));
  }
  let user = await User.findOne({ phoneNumber });
  let newUser;
  if (!user) {
    user = await User.create({ phoneNumber });
    const cart = await Cart.create({ userId: user._id });
    user.cartId = cart._id;
    newUser = await user.save();
  } else {
    newUser = user;
  }
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );
  return res.status(200).json({
    status: true,
    message: "login successfully",
    data: {
      token,
      user: {
        _id: newUser._id,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
        fullName: newUser.fullName,
        cartId: newUser.cartId,
      },
    },
  });
});
export const resendCode = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const resultSms =await sendAuthCode(phoneNumber);
  if (!resultSms) {
    return res.status(500).json({
      status: false,
      message: resultSms.message,
    });
  }
  return res.status(200).json({
    status: true,
    message: "OTP Code sent",
  });
});
export const forgetPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber, newPassword, code } = req.body;
  const verify = await verifyCode(phoneNumber, code);
  if (!verify) {
    return next(new HandleERROR("in valid code", 404));
  }
  let user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("not found user", 400));
  }
  const hashPassword = bcryptjs.hashSync(newPassword, 10);
  user.password = hashPassword;
  await user.save();
  return res.status(200).json({
    status: true,
    message: "new password set",
  });
});
