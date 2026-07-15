import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listStoreOrders,
  getStoreOrder,
  updateStoreOrderStatus,
} from "../../api/orders/storeOrders";
import type { OrderStatus } from "../../schemas/order";

export function useStoreOrders(page = 1, size = 50) {
  return useQuery({
    queryKey: ["store-orders", page, size],
    queryFn: () => listStoreOrders(page, size),
  });
}

export function useGetStoreOrder(orderId: string | number | undefined) {
  const id = orderId ? Number(orderId) : undefined;

  return useQuery({
    queryKey: ["store-order", id],
    queryFn: () => getStoreOrder(id!),
    enabled: !!id,
  });
}

export function useUpdateStoreOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
      trackingCode,
    }: {
      orderId: number;
      status: OrderStatus;
      trackingCode?: string | null;
    }) =>
      updateStoreOrderStatus(orderId, {
        status,
        tracking_code: trackingCode ?? null,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["store-orders"] });
      queryClient.invalidateQueries({ queryKey: ["store-order", variables.orderId] });
    },
  });
}