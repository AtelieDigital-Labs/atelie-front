import { api } from "../client";
import type {
  CartResponse,
  CartItemCreate,
  CartItemUpdate,
  CartItemReadUpdated,
} from "../../schemas/cart";

export async function getCart(): Promise<CartResponse> {
  const { data } = await api.get<CartResponse>("/api/v1/carts/");
  return data;
}

export async function addCartItem(
  item: CartItemCreate
): Promise<CartItemReadUpdated> {
  const { data } = await api.post<CartItemReadUpdated>(
    "/api/v1/carts/items/",
    item
  );
  return data;
}

export async function updateCartItem(
  itemId: string,
  item: CartItemUpdate
): Promise<CartItemReadUpdated> {
  const { data } = await api.patch<CartItemReadUpdated>(
    `/api/v1/carts/items/${itemId}`,
    item
  );
  return data;
}

export async function removeCartItem(itemId: string): Promise<string> {
  const { data } = await api.delete<string>(`/api/v1/carts/items/${itemId}`);
  return data;
}

export async function clearCart(): Promise<void> {
  await api.delete("/api/v1/carts/");
}