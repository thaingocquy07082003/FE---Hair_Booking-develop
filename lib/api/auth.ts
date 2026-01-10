import axios from "axios";
import api from "../axios";

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export async function registerUser(data: RegisterUserData) {
  console.log("======================================================");
  const response = await api.post("/auth/register", data);
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
