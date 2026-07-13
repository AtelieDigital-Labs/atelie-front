import { api } from "../client";
import {type Product, type ProductsResponse} from '../../schemas/product'

export async function listProducts(): Promise<Product[]> {
  const response = await api.get<ProductsResponse>("/api/v1/catalog/products/");
  return response.data.products;
}

export async function createProduct() {
  const response = await api.post("/api/catalog/products");
  return response.data;
}

export async function getProduct(productId: number){
  const { data } = await api.get<Product>(
    `/api/v1/catalog/products/${productId}`
  );

  return data;
}

export async function patchProduct() {
  const response = await api.patch("/api/catalog/products");
  return response.data;
}


export async function getProductVariation(variationId: number) {
  const { data } = await api.get(
    `/api/v1/catalog/products/variations/${variationId}`
  );
  return data;
}