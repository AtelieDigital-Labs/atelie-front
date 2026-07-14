import { api } from "../client";
import type {
  OrderCheckoutRequest,
  OrderCreated,
  OrdersPage,
  OrderPaymentRequest,
  OrderRead,
} from "../../schemas/order";

export async function listOrders(page = 1, size = 10): Promise<OrdersPage> {
  const { data } = await api.get<OrdersPage>("/api/v1/orders/", {
    params: { page, size },
  });
  return data;
}

export async function getOrder(orderId: number): Promise<OrderRead> {
  const { data } = await api.get<OrderRead>(`/api/v1/orders/${orderId}`);
  return data;
}

export async function createOrder(
  payload: OrderCheckoutRequest
): Promise<OrderCreated> {
  const { data } = await api.post<OrderCreated>(
    "/api/v1/orders/",
    payload
  );
  return data;
}

export async function retryOrderPayment(
  payload: OrderPaymentRequest
): Promise<OrderCreated> {
  const { data } = await api.post<OrderCreated>(
    "/api/v1/orders/payments/retry",
    payload
  );
  return data;
}