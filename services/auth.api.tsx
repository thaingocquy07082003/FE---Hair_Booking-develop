import api from "@/lib/axios";

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
