import type {  orderReadSchema, orderCreatedSchema, OrderRead } from "../../schemas/order";
import { api } from "../client";

export async function getMeOrders(): Promise<OrderRead[]> {
  const response = await api.get("/api/v1/orders/");
  return response.data.items;
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

export async function getStoreOrders(): Promise<Order[]> {
  const { data } = await api.get(`/api/v1/stores/orders/`)
  return data.items
}

export async function getStoreOrder(StoreId: number): Promise<OrderRead> {
  const { data } = await api.get(`/api/v1/stores/orders/${StoreId}`)
  return data
}