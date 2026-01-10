import api from "@/lib/axios";

export const getInvoicesListByUser = async () => {
  const response = await api.get(`/invoices/user`);
  return response.data;
};
