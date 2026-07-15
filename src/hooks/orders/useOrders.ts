import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { api } from "../../api/client";
import {
  getMeOrders,
  getStoreOrders,
} from "../../api/orders/orders";
import { getOrderById, retryPayment } from '../../api/orders/orders';
import {
  createOrder,
  listOrders,
  retryOrderPayment,
} from "../../api/orders/userOrders";
import {
  artisanOrdersPageSchema,
  orderArtisanReadSchema,
  type ArtisanOrdersPage,
  type OrderArtisanRead,
  type OrderCheckoutRequest,
  type OrderPaymentRequest,
  type OrderStatus,
} from "../../schemas/order";

// ==========================================
// CLIENT / USER ORDERS HOOKS
// ==========================================

export function useOrders(page = 1, size = 10) {
  return useQuery({
    queryKey: ["orders", page, size],
    queryFn: () => listOrders(page, size),
  });
}

/**
 * Hook para buscar um pedido por ID.
 * Só executa a query se houver um orderId válido.
 */
export function useOrder(orderId?: number) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId && !isNaN(orderId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'PAID' || status === 'EXPIRED' ? false : 5000
    },
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

export function useGetMeOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getMeOrders(),
  });
}

/**
 * Hook para reprocessar o pagamento de um grupo de checkout.
 */
export function useRetryPayment() {
  return useMutation({
    mutationFn: (checkoutGroupId: string) => retryPayment(checkoutGroupId),
  });
}

// ==========================================
// STORE / ARTISAN ORDERS HOOKS
// ==========================================

const artisanOrdersListSchema = z.array(orderArtisanReadSchema);

/**
 * Hook para buscar TODOS os pedidos do artesão (Retorna Array direto)
 */
export function useGetStoreOrders(page: number) {
  return useQuery<ArtisanOrdersPage>({
    queryKey: ['store-orders', page],
    queryFn: async () => {
      const { data } = await api.get('api/v1/stores/orders/');
      return artisanOrdersPageSchema.parse(data);
    },
  });
}

/**
 * Hook para buscar um único pedido detalhado da loja
 */
export function useGetStoreOrder(orderId: string | undefined) {
  return useQuery<OrderArtisanRead>({
    queryKey: ['store-order', orderId],
    queryFn: async () => {
      const { data } = await api.get(`api/v1/stores/orders/${orderId}`);
      return orderArtisanReadSchema.parse(data);
    },
    enabled: !!orderId,
  });
}

/**
 * Hook para atualizar o status do pedido do artesão
 */
export function useUpdateStoreOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      trackingCode,
    }: {
      orderId: number;
      status: OrderStatus;
      trackingCode?: string | null;
    }) => {
      const { data } = await api.patch(`/stores/orders/${orderId}/status`, {
        status,
        tracking_code: trackingCode || undefined,
      });
      return orderArtisanReadSchema.parse(data);
    },
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['store-orders'] });
      queryClient.setQueryData(['store-order', String(updatedOrder.order_id)], updatedOrder);
    },
  });
}