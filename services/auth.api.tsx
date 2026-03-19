import api from "@/lib/axios";

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post("http://localhost:3001/api/v1/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
