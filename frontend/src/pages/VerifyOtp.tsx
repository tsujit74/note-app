import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../api/api";

interface OtpForm {
  otp: string;
}

export default function VerifyOtp() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<OtpForm>();
  const api = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  // Get userId from previous page (login/signup)
  const { userId } = location.state || {};

  const onSubmit = async (data: OtpForm) => {
    setErrorMessage("");

    if (!userId) {
      setErrorMessage("Missing userId. Please login again.");
      return;
    }

    try {
      const res = await api.post("/auth/verify-otp", {
        userId, 
        otp: data.otp,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setErrorMessage("Verification failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Verify OTP</h1>
        <p className="text-gray-500 font-medium mb-8">
          Please enter the 6-digit OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <input
            type="text"
            maxLength={6}
            {...register("otp", { required: true, minLength: 6, maxLength: 6 })}
            placeholder="Enter 6-digit OTP"
            className="w-full p-3 text-center text-lg border-2 border-gray-300 rounded-xl tracking-widest focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
          />

          {errorMessage && (
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition duration-200 disabled:bg-purple-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}
