import { api } from "../client";
import type { CartShippingResponse } from "../../schemas/shipping";

export async function getShippingOptions(
  addressId: string
): Promise<CartShippingResponse> {
  const { data } = await api.get<CartShippingResponse>(
    `/api/v1/checkout/shipping/${addressId}`
  );
  return data;
}