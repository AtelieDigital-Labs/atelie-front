import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createStore, getMeStore, getMeStoreProducts, getStore, getStoreProducts, updateStore } from "../../api/catalogs/stores";
import type { StoreCreate, StoreUpdate } from "../../schemas/store";

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

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreCreate) => createStore(data),
    onSuccess: (store) => {
      queryClient.setQueryData(["store"], store.id);
    },
    
  })
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number, data: StoreUpdate) => updateStore(id, data),
    // onSuccess: (store) => {
    //   queryClient.(["store"], store.id);
    // },
    
  })
}

export function useGetStoreProducts(storeId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["store-products", storeId],
    queryFn: () => getStoreProducts(storeId),
    enabled: options?.enabled
  });
}

export function useGetMeStoreProducts(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["store-products"],
    queryFn: getMeStoreProducts,
    enabled: options?.enabled
  });
}