// hooks/catalog/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { listProducts, getProduct } from "../../api/catalogs/products";

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