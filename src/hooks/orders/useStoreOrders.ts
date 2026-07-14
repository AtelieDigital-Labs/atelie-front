import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listStoreOrders,
  getStoreOrder,
  updateStoreOrderStatus,
} from "../../api/orders/storeOrders";
import type { OrderArtisanStatusUpdate } from "../../schemas/order";

export function useStoreOrders(page = 1, size = 50) {
  return useQuery({
    queryKey: ["store-orders", page, size],
    queryFn: () => listStoreOrders(page, size),
  });
}

export function useStoreOrder(orderId: number) {
  return useQuery({
    queryKey: ["store-order", orderId],
    queryFn: () => getStoreOrder(orderId),
    enabled: !!orderId,
  });
}

export function useUpdateStoreOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: OrderArtisanStatusUpdate;
    }) => updateStoreOrderStatus(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["store-orders"] });
      queryClient.invalidateQueries({ queryKey: ["store-order", variables.orderId] });
    },
  });
}