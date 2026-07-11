import { useQuery } from "@tanstack/react-query";
import { getMeStore, getStore, getStoreProducts } from "../../api/catalogs/stores";

export function useGetStore(storeId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStore(storeId),
    enabled: options?.enabled
  });
}

export function useGetMeStore(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["store"],
    queryFn: getMeStore,
    enabled: options?.enabled
  });
}

export function useStoreProducts(storeId: number) {
  return useQuery({
    queryKey: ["store-products", storeId],
    queryFn: () => getStoreProducts(storeId),
    
  });
}