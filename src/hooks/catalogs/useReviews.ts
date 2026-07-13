import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReviews, listReviews } from "../../api/catalogs/reviews";
import type { ReviewInput } from "../../schemas/review";

export function useReviews(productId: number) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => listReviews(productId),
  });
}

type CreateReviewInput = {
  productId: number;
  review: ReviewInput;
};

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, review }: CreateReviewInput) =>
      createReviews(productId, review),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });
    },
  });
}