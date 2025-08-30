import express from 'express';
import { signup, verifyOTP, login, resendOTP } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/resend-otp', resendOTP);

export default router;
