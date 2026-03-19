import api from "@/lib/axios";

export interface Stylist {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  experience: number;
  rating: number;
  totalBookings: number;
  specialties: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getAllStylists = async (): Promise<Stylist[]> => {
  const response = await api.get("http://localhost:3002/api/v1/hairstyles/stylists/all");
  return response.data.data;
};