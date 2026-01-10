import api from "@/lib/axios";

interface ImageData {
  size: number;
  contentType: string;
}

export const preSignedUrl = async (imageData: ImageData) => {
  const response = await api.post("/pre-signed-url", imageData);
  return response.data;
};

export const getImageLightXResponse = async ({
  imageUrl,
  textPrompt,
}: {
  imageUrl: string;
  textPrompt: string;
}) => {
  const response = await api.post("/upload-image-lightX", {
    imageUrl,
    textPrompt,
  });
  return response;
};

export const getOrderStatus = async (orderId: string) => {
  const response = await api.get(`/order-status/${orderId}`);
  return response;
};
