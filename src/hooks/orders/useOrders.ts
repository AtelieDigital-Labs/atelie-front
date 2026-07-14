import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listOrders,
  getOrder,
  createOrder,
  retryOrderPayment,
} from "../../api/orders/userOrders";
import type { OrderCheckoutRequest, OrderPaymentRequest } from "../../schemas/order";

export function useOrders(page = 1, size = 10) {
  return useQuery({
    queryKey: ["orders", page, size],
    queryFn: () => listOrders(page, size),
  });
}

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrderCheckoutRequest) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(["cart"], {
        items: [],
        total_quantity: 0,
        total_price: 0,
      });
    },
  });
}

export function useRetryOrderPayment() {
  return useMutation({
    mutationFn: (payload: OrderPaymentRequest) => retryOrderPayment(payload),
  });
}