import api from "@/lib/axios";

export const getBranchsList = async () => {
  try {
    const response = await api.get("/branchs");
    return response.data;
  } catch (error) {
    console.error("Get branchs list error:", error);
    throw error;
  }
};

export const getHaiStyleList = async () => {
  try {
    const response = await api.get("/hair-styles/list");
    return response.data;
  } catch (error) {
    console.error("Get branchs list error:", error);
    throw error;
  }
};

export const getAllStylists = async () => {
  try {
    const response = await api.get("/hair-styles/list-hair-stylist");
    return response.data;
  } catch (error) {
    console.error("Get hair-stylist list error:", error);
    throw error;
  }
};

export const getAvailableBooking = async (stylistId: any, date: any) => {
  try {
    const response = await api.get("/appointments/available-times", {
      params: {
        stylistId,
        date,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get available times error:", error);
    throw error;
  }
};
