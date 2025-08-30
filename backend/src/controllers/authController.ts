import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../services/otpService";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);


const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpiry,
    isVerified: false,
  });

  await user.save();

  try {
    await sendOTP(email, otp);
  } catch (err) {
    console.error("OTP email failed, using fallback:", otp);
  }

  return res.status(200).json({
    message: "OTP sent",
    userId: user._id,
    devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
  });
};


export const verifyOTP = async (req: Request, res: Response) => {
  const { userId, otp } = req.body;

  if (!userId || !otp)
    return res.status(400).json({ message: "UserId and OTP are required" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = "";
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return res.json({ message: "Verification successful", token });
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch)
    return res.status(400).json({ message: "Incorrect password" });

  // Generate new OTP
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  try {
    await sendOTP(email, otp);
  } catch (err) {
    console.error("OTP email failed, using fallback:", otp);
  }

  return res.status(200).json({
    message: "OTP sent",
    userId: user._id,
    devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
  });
};


 
export const resendOTP = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "UserId is required" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  try {
    await sendOTP(user.email, otp);
  } catch (err) {
    console.error("Resend OTP email failed, using fallback:", otp);
  }

  return res.status(200).json({
    message: "OTP resent successfully",
    devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
  });
};


export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body; 
    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Existing user with password → cannot login via Google
      if (user.password) {
        return res.status(400).json({
          message:
            "This email is registered with a password. Please login using email & password.",
        });
      }
    } else {
      // Create new user for Google login
      user = new User({
        name,
        email,
        password: null, 
        isVerified: true,
      });
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Google login successful",
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email, picture },
    });
  } catch (err: any) {
    console.error("Google login error:", err.response?.data || err.message);
    return res.status(500).json({
      message: err.response?.data?.message || "Google login failed",
    });
  }
};
