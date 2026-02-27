import axios from "axios";
import api from "../axios";

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResendOtpData {
  email: string;
}

export async function registerUser(data: RegisterUserData) {
  console.log("======================================================");
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function verifyOtp(data: VerifyOtpData) {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
}

export async function resendOtp(data: ResendOtpData) {
  const response = await api.post("/auth/resend-otp", data);
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
