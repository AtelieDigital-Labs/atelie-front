import { api } from "../client";
import type {
  OrderArtisanPage,
  OrderArtisanRead,
  OrderArtisanStatusUpdate,
} from "../../schemas/order";

export async function listStoreOrders(page = 1, size = 50): Promise<OrderArtisanPage> {
  const { data } = await api.get<OrderArtisanPage>("/api/v1/stores/orders/", {
    params: { page, size },
  });
  return data;
}

export async function getStoreOrder(orderId: number): Promise<OrderArtisanRead> {
  const { data } = await api.get<OrderArtisanRead>(`/api/v1/stores/orders/${orderId}`);
  return data;
}

export async function updateStoreOrderStatus(
  orderId: number,
  payload: OrderArtisanStatusUpdate
): Promise<OrderArtisanRead> {
  const { data } = await api.patch<OrderArtisanRead>(
    `/api/v1/stores/orders/${orderId}/status`,
    payload
  );
  return data;
}