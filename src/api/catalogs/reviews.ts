import type { ReviewInput, ReviewPublic } from "../../schemas/review";
import { api } from "../client";


export async function listReviews(productId: number): Promise<ReviewPublic[]> {
  const { data } = await api.get(`/api/v1/catalog/reviews/${productId}`);
  return data.reviews;
}

export async function createReviews(productId: number, review:ReviewInput): Promise<ReviewPublic> {
  const { data } = await api.post(`/api/v1/catalog/reviews/${productId}`, review);
  return data;
}
