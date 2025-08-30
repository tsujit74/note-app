// routes/authRoutes.ts
import express from "express";
import { 
  signup, 
  verifyOTP, 
  login, 
  resendOTP, 
  googleLogin 
} from "../controllers/authController";

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Signup using email + OTP
 */
router.post("/signup", signup);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP during signup
 */
router.post("/verify-otp", verifyOTP);

/**
 * @route   POST /api/auth/login
 * @desc    Login with email + password
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP if expired or not received
 */
router.post("/resend-otp", resendOTP);

/**
 * @route   POST /api/auth/google
 * @desc    Signup/Login with Google
 */
router.post("/google", googleLogin);

export default router;
