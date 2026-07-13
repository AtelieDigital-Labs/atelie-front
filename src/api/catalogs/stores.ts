import { api } from "../client";
import type { StoreCreate, StorePublic, StoreUpdate } from "../../schemas/store";
import type { Product, ProductsResponse } from "../../schemas/product";

export async function getMeStore(): Promise<StorePublic> {
  const { data } = await api.get(`/api/v1/catalog/stores/me`);
  return data;
}

export async function createStore(data: StoreCreate): Promise<StorePublic> {
  const response = await api.post("/api/v1/catalog/stores/", data);

  return response.data;
}

export async function updateStore(data: StoreUpdate): Promise<StorePublic> {
  const response = await api.patch(`/api/v1/catalog/stores/me`, data);
  return response.data;
}

export async function getStore(id: number): Promise<StorePublic> {
  const { data } = await api.get(`/api/v1/catalog/stores/${id}`);
  return data;
}

export async function getStoreProducts(storeId: number) {
  const { data } = await api.get<ProductsResponse>(
    `/api/v1/catalog/stores/${storeId}/products/`
  );

  return data;
}

export async function getMeStoreProducts() {
  const { data } = await api.get<ProductsResponse>(
    `/api/v1/catalog/stores/me/products/`
  );

  return data;
}