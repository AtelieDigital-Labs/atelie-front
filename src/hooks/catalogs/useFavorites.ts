import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIsFavorites, getFavorites } from "../../api/catalogs/favorites";

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
}

export function useCreateIsFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIsFavorites,

    onSuccess: (favorite) => {
      queryClient.setQueryData(
        ["isFavorite", favorite.product_id],
        true
      );

      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}