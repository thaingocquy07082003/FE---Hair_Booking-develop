import api from "@/lib/axios";

export const createReview = async ({
  rating,
  review,
  invoiceId,
}: {
  rating: number;
  review: string;
  invoiceId: string;
}) => {
  try {
    const response = await api.post("/reviews", {
      rating,
      review,
      invoiceId,
    });
    return response.data;
  } catch (error) {
    console.error("Create review error:", error);
    throw error;
  }
};

export const updateReview = async ({
  rating,
  review,
  reviewId,
}: {
  rating: number;
  review: string;
  reviewId: string;
}) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, {
      rating,
      review,
    });
    return response.data;
  } catch (error) {
    console.error("Update review error:", error);
    throw error;
  }
};
