import { api } from "../client";
import type { Product } from "../../schemas/product";
import type { StorePublic } from "../../schemas/store";

export async function getMeStore(): Promise<StorePublic> {
  const { data } = await api.get(`/api/v1/catalog/stores/me`);
  return data;
}


export async function getStore(id: number): Promise<StorePublic> {
  const { data } = await api.get(`/api/v1/catalog/stores/${id}`);
  return data;
}


export async function getStoreProducts(id: number): Promise<Product[]> {
  const { data } = await api.get(`/api/catalog/stores/${id}/products`);
  return data;
}