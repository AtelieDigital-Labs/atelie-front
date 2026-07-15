import type {  orderReadSchema, orderCreatedSchema, OrderRead, OrderArtisanRead, OrderStatus,OrdersPage } from "../../schemas/order";
import { api } from "../client";

export async function getMeOrders(
  page = 1,
  size = 10,
  status?: OrderStatus
): Promise<OrdersPage> {
  const { data } = await api.get<OrdersPage>("/api/v1/orders/", {
    params: { page, size, status },
  });
  return data;
}

/**
 * Busca os detalhes de um pedido pelo ID.
 * Endpoint: GET /api/v1/orders/{order_id}
 */
export async function getOrderById(orderId: number): Promise<OrderRead> {
  const { data } = await api.get(`/api/v1/orders/${orderId}`)
  return data
}

/**
 * Tenta reprocessar/gerar um novo pagamento para o pedido.
 * Endpoint: POST /api/v1/orders/payments/retry
 */
export async function retryPayment(checkoutGroupId: string) {
  const { data } = await api.post('/api/v1/orders/payments/retry', {
    checkout_group_id: checkoutGroupId,
  })
  return data
}

export async function getStoreOrders(): Promise<OrderArtisanRead[]> {
  const { data } = await api.get(`/api/v1/stores/orders/`)
  return data.items
}

export async function getStoreOrder(StoreId: number): Promise<OrderRead> {
  const { data } = await api.get(`/api/v1/stores/orders/${StoreId}`)
  return data
}