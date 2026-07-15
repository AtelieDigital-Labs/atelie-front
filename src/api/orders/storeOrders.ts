import { api } from "../client";
import {
  orderArtisanPageSchema,
  orderArtisanReadSchema,
  type OrderArtisanStatusUpdate,
} from "../../schemas/order";

export async function listStoreOrders(page = 1, size = 50) {
  const { data } = await api.get("/api/v1/stores/orders/", {
    params: { page, size },
  });
  return orderArtisanPageSchema.parse(data);
}

export async function getStoreOrder(orderId: number) {
  const { data } = await api.get(`/api/v1/stores/orders/${orderId}`);
  return orderArtisanReadSchema.parse(data);
}

export async function updateStoreOrderStatus(
  orderId: number,
  payload: OrderArtisanStatusUpdate
) {
  const { data } = await api.patch(
    `/api/v1/stores/orders/${orderId}/status`,
    payload
  );
  return orderArtisanReadSchema.parse(data);
}