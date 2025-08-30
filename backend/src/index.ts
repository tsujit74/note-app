import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";

import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

// ===== Middleware =====
app.use(cors({
  origin: "https://your-frontend-domain.vercel.app",
  credentials: true
}));
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan("dev")); 

// ===== Routes =====
app.use("/api/auth", authRoutes); // Signup/Login/OTP/Google login
app.use("/api/notes", authMiddleware, noteRoutes); // Protected Notes routes
app.use("/api/user", userRoutes);

// ===== Health Check =====
app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("API is running...");
});

// ===== 404 Handler =====
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ===== Global Error Handler =====
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(` Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
