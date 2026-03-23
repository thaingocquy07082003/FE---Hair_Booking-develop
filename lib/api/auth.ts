import axios from "axios";
import api from "../axios";

export interface RegisterUserData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResendOtpData {
  email: string;
}

export async function registerUser(data: RegisterUserData) {
  const response = await axios.post(
    "http://localhost:3001/api/v1/auth/register",
    data
  );
  return response.data;
}

export async function verifyOtp(data: VerifyOtpData) {
  const response = await api.post("http://localhost:3001/api/v1/auth/verify-otp", data);
  return response.data;
}

export async function resendOtp(data: ResendOtpData) {
  const response = await api.post("http://localhost:3001/api/v1/auth/resend-otp", data);
  return response.data;
}

// export const login = async (credentials: LoginCredentials) => {
//   try {
//     const response = await api.post("/auth/login", credentials);
//     return response.data;
//   } catch (error) {
//     console.error("Login error:", error);
//     throw error;
//   }
// };
