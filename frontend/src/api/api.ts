// src/api/api.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useError } from "../contexts/ErrorContext";

// Base URL from env or fallback
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create a single Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach token if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Fix: Track if interceptor already added ---
let responseInterceptorAttached = false;

// Custom hook for using API with global error handling
export const useApi = (): AxiosInstance => {
  const { setErrors } = useError();

  if (!responseInterceptorAttached) {
    api.interceptors.response.use(
      (response) => {
        setErrors([]); // clear previous errors on success
        return response;
      },
      (error: AxiosError<any>) => {
        if (error.response?.data) {
          const data = error.response.data;

          if (Array.isArray((data as any).errors)) {
            setErrors((data as any).errors);
          } else if (typeof (data as any).message === "string") {
            setErrors([(data as any).message]);
          } else {
            setErrors(["Unexpected server error."]);
          }
        } else if (error.request) {
          setErrors(["No response from server."]);
        } else {
          setErrors(["Request setup error."]);
        }

        return Promise.reject(error);
      }
    );

    responseInterceptorAttached = true;
  }

  return api;
};

export default api;
