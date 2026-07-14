import type { ReviewSummary } from "../../schemas/review";
import { api } from "../client";

export async function getIaSummary(productId: number): Promise<ReviewSummary> {
  const response = await api.get<ReviewSummary>(
    `/api/v1/ia/reviews/summary/`,
    {
      params: {
        product_id: productId || undefined,
      },
    }
)

  return response.data;
}