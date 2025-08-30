import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/api";
import SuccessDisplay from "../components/SuccessDisplay";
import ErrorDisplay from "../components/ErrorDisplay";
import { useSuccess } from "../contexts/SuccessContext";
import { useError } from "../contexts/ErrorContext";
import { useAuth } from "../contexts/AuthContext";

interface LoginForm { email: string; password: string; }
interface OtpForm { otp: string; }

export default function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>();
  const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { isSubmitting: isOtpSubmitting } } = useForm<OtpForm>();
  const api = useApi();
  const navigate = useNavigate();
  const { addSuccess } = useSuccess();
  const { setErrors } = useError();
  const { setToken } = useAuth();

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false); // NEW: disable while sending OTP

  // Countdown for Resend OTP button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const onSubmit = async (data: LoginForm) => {
    setIsSendingOtp(true);
    try {
      const res = await api.post("/auth/login", data);
      if (res.data?.userId) {
        setUserId(res.data.userId);
        setShowOtpInput(true);
        setDevOtp(res.data.devOtp);
        addSuccess("OTP sent to your email. Enter it below.");
        setResendTimer(30); // start 30s timer
      } else {
        setErrors(["Unexpected response from server."]);
      }
    } catch (err: any) {
      setErrors([err.response?.data?.message || "Invalid email or password."]);
    } finally {
      setIsSendingOtp(false); // Re-enable button after sending
    }
  };

  const onVerifyOtp = async (data: OtpForm) => {
    if (!userId) return setErrors(["User not found."]);
    if (!data.otp || data.otp.length !== 6) return setErrors(["Enter a valid 6-digit OTP."]);

    try {
      const res = await api.post("/auth/verify-otp", { userId, otp: data.otp });
      if (res.data?.token) {
        setToken(res.data.token);
        addSuccess("Login successful!");
        navigate("/dashboard");
      } else {
        setOtpAttempts(prev => prev + 1);
        setErrors(["OTP verification failed."]);
      }
    } catch (err: any) {
      setOtpAttempts(prev => prev + 1);
      setErrors([err.response?.data?.message || "OTP invalid or expired."]);
    }
  };

  const handleResendOtp = async () => {
    if (!userId) return setErrors(["Cannot resend OTP without logging in."]);
    if (resendTimer > 0 || isSendingOtp) return; // prevent resend while timer or sending

    setIsSendingOtp(true);
    try {
      const res = await api.post("/auth/resend-otp", { userId });
      setDevOtp(res.data?.devOtp);
      addSuccess("OTP resent successfully.");
      setResendTimer(30); // reset timer
    } catch (err: any) {
      setErrors([err.response?.data?.message || "Failed to resend OTP."]);
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 relative">
      <SuccessDisplay />
      <ErrorDisplay />
      <div className="flex w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden bg-white">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
            <p className="text-gray-500 font-medium mb-8">
              {!showOtpInput ? "Enter your login credentials." : "Enter the OTP sent to your email."}
            </p>

            {!showOtpInput && (
              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                <input type="email" {...register("email", { required: "Email is required" })} placeholder="Email" className="w-full p-3 border rounded-xl" />
                <input type="password" {...register("password", { required: "Password is required" })} placeholder="Password" className="w-full p-3 border rounded-xl" />
                <button type="submit" disabled={isSubmitting || isSendingOtp} className="w-full p-3 bg-green-500 text-white rounded-xl">{isSubmitting || isSendingOtp ? "Sending OTP..." : "Login"}</button>
              </form>
            )}

            {showOtpInput && (
              <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="w-full space-y-6">
                <input type="text" maxLength={6} {...registerOtp("otp", { required: true, minLength: 6, maxLength: 6 })} placeholder="Enter OTP" className="w-full p-3 text-center border rounded-xl" />
                {devOtp && <p className="text-gray-500 text-sm">Dev OTP: {devOtp}</p>}
                <button type="submit" disabled={isOtpSubmitting || otpAttempts >= 5} className="w-full p-3 bg-purple-500 text-white rounded-xl">{isOtpSubmitting ? "Verifying..." : "Verify OTP"}</button>
                {otpAttempts >= 5 && <p className="text-red-500 text-center">Too many failed attempts. Resend OTP.</p>}
                <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || isSendingOtp} className={`w-full p-2 text-sm ${resendTimer > 0 || isSendingOtp ? "text-gray-400" : "text-blue-500"}`}>
                  {isSendingOtp ? "Sending OTP..." : (resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP")}
                </button>
              </form>
            )}

            <p className="mt-6 text-sm text-center text-gray-500">
              Don’t have an account? <a href="/signup" className="text-green-600 font-semibold">Sign Up</a>
            </p>
          </div>
        </div>

        <div className="flex-1 hidden md:flex bg-gray-900 overflow-hidden">
          <div className="w-full h-full rounded-2xl bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1000x1000/000000/FFFFFF?text=Modern+Design')" }} />
        </div>
      </div>
    </div>
  );
}
