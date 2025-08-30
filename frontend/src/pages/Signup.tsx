import { useForm } from "react-hook-form";
import { useState } from "react";
import { useApi } from "../api/api";
import { useNavigate } from "react-router-dom";
import SuccessDisplay from "../components/SuccessDisplay";
import ErrorDisplay from "../components/ErrorDisplay";
import { useSuccess } from "../contexts/SuccessContext";
import { useError } from "../contexts/ErrorContext";
import { GoogleLogin } from "@react-oauth/google";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

interface OTPForm {
  otp: string;
}

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>();
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { isSubmitting: isOtpSubmitting },
  } = useForm<OTPForm>();
  const api = useApi();
  const navigate = useNavigate();
  const { addSuccess } = useSuccess();
  const { setErrors } = useError();

  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [userId, setUserId] = useState<string>("");
  const [devOtp, setDevOtp] = useState<string | undefined>();

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      console.log("Google credential response:", credentialResponse);

      if (!credentialResponse.credential) {
        setErrors(["No credential received from Google"]);
        return;
      }

      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      console.log("Backend response:", res.data);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        addSuccess("Google login/signup successful!");
        navigate("/dashboard");
      } else {
        setErrors(["No token returned from backend"]);
      }
    } catch (err: any) {
      console.error("Google login error:", err.response?.data || err.message);
      setErrors([err.response?.data?.message || "Google login failed"]);
    }
  };

  // Step 1: Signup → send OTP
  const onSubmit = async (data: SignupForm) => {
    try {
      const res = await api.post("/auth/signup", data);
      if (res.data?.userId) {
        setUserId(res.data.userId);
        setStep("otp");
        setDevOtp(res.data.devOtp);
        addSuccess(
          "OTP sent to your email. Please enter it below to continue."
        );
      } else {
        setErrors(["Unexpected response from server."]);
      }
    } catch (err: any) {
      setErrors([
        err.response?.data?.message || "Signup failed. Please try again.",
      ]);
    }
  };

  // Step 2: Verify OTP
  const onVerifyOtp = async (data: OTPForm) => {
    if (!userId) return setErrors(["User not found. Please try again."]);

    try {
      const res = await api.post("/auth/verify-otp", {
        userId,
        otp: data.otp,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        addSuccess("Account verified successfully! You can now login.");
        navigate("/login");
      } else {
        setErrors(["OTP verification failed. Please try again."]);
      }
    } catch (err: any) {
      setErrors([err.response?.data?.message || "Invalid or expired OTP."]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-white relative">
        <SuccessDisplay />
        <ErrorDisplay />

        <div className="flex w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Side */}
          <div className="flex-1 flex items-center justify-center p-4 bg-white">
            <div className="w-full max-w-md">
              {step === "signup" && (
                <>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Sign up
                  </h1>
                  <p className="text-gray-500 font-medium mb-5">
                    Please enter your details to create an account.
                  </p>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                  >
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        placeholder="Your full name"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                        placeholder="Your email address"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        placeholder="Create your password"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full p-3 mt-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition duration-200 disabled:bg-green-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Signing up..." : "Sign Up"}
                    </button>
                  </form>

                  <div className="my-2 text-center text-gray-400">OR</div>

                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => setErrors(["Google login failed"])}
                    />
                  </div>
                </>
              )}

              {step === "otp" && (
                <>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Verify OTP
                  </h1>
                  <p className="text-gray-500 font-medium mb-8">
                    Enter the OTP sent to your email to complete signup.
                  </p>
                  <form
                    onSubmit={handleOtpSubmit(onVerifyOtp)}
                    className="w-full space-y-6"
                  >
                    <input
                      type="text"
                      maxLength={6}
                      {...registerOtp("otp", {
                        required: true,
                        minLength: 6,
                        maxLength: 6,
                      })}
                      placeholder="Enter 6-digit OTP"
                      className="w-full p-3 text-center text-lg border-2 border-gray-300 rounded-xl tracking-widest focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    />
                    {devOtp && (
                      <p className="text-gray-500 text-sm">
                        <strong>Dev OTP (for testing):</strong> {devOtp}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isOtpSubmitting}
                      className="w-full p-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition duration-200 disabled:bg-purple-300 disabled:cursor-not-allowed"
                    >
                      {isOtpSubmitting ? "Verifying..." : "Verify OTP"}
                    </button>
                  </form>
                </>
              )}

              <p className="mt-6 text-sm text-center text-gray-500">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-green-600 font-semibold hover:underline"
                >
                  Login
                </a>
              </p>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="flex-1 hidden md:flex items-center justify-center bg-gray-900 overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/container.png')" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
