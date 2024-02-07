import express from "express";
import {
  login,
  loginOtp,
  loginVerifyOtp,
  sendOtp,
  signUp,
  verifyOtp,
} from "../Controlles/AuthController.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/new-sign", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/new-login", loginOtp);

router.post("/login-verify-otp", loginVerifyOtp);

router.post("/login", login);

export default router;
