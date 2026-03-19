import api from "@/lib/axios";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  verified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get("http://localhost:3002/api/v1/profiles/me");
  return response.data.data;
};

export const updateMyProfile = async (data: {
  fullName?: string;
  phone?: string;
  avatar?: File | null;
}): Promise<UserProfile> => {
  const formData = new FormData();
  if (data.fullName) formData.append("fullName", data.fullName);
  if (data.phone) formData.append("phone", data.phone);
  if (data.avatar) formData.append("avatar", data.avatar);

  const response = await api.put("http://localhost:3002/api/v1/profiles/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};