import { Request, Response } from "express";
import User from "../models/User"; // adjust path to your User model

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.userId; // matches your authMiddleware
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Select both name and email
    const user = await User.findById(userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
