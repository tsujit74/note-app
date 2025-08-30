import { Router } from "express";
import { getMe } from "../controllers/userController";
import {authMiddleware} from "../middleware/authMiddleware"; // verifies JWT

const router = Router();

router.get("/me", authMiddleware, getMe);

export default router;
