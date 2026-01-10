import api from "@/lib/axios";

interface AppointmentData {
  branchId: string;
  serviceId: string;
  phone: string;
  date: Date;
  notes?: string;
  username?: string;
  hairStylistId?: string;
}

export const statusAppointment = {
  ALL: "all",
  ACCEPTED: "accepted",
  CANCELLED: "cancelled",
  UPCOMING: "upcoming",
};

export const createAppointment = async (data: AppointmentData) => {
  const response = await api.post("/appointments", data);
  return response;
};

export const getAppointments = async () => {
  const response = await api.get("/appointments");
  return response.data;
};

export const cancelAppointment = async (appointmentId: string) => {
  const response = await api.put(`/appointments/${appointmentId}/cancel`);
  return response.data;
};
