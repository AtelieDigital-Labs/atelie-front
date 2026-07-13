// hooks/catalog/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { listProducts, getProduct, listProductsFavorites } from "../../api/catalogs/products";


export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });
}

export function useProduct(productId: number) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });
}

export function useProductsFavorites(ids: number[]) {
  return useQuery({
    queryKey: ["product-favorites", ids],
    queryFn: () => listProductsFavorites(ids),
    enabled: ids.length > 0,
  });
}