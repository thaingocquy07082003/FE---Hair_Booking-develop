import api from "@/lib/axios";

export const getServiceList = async () => {
  try {
    const response = await api.get("/service");
    return response.data;
  } catch (error) {
    console.error("Get service list error:", error);
    throw error;
  }
};
