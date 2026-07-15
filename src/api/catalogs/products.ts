import { api } from "../client";
import {type Product, type ProductsResponse} from '../../schemas/product'

export async function listProducts(): Promise<Product[]> {
  const response = await api.get<ProductsResponse>("/api/v1/catalog/products/");
  return response.data.products;
}

export async function listProductsSearch(
  q?: string,
  categoryId?: number
): Promise<Product[]> {
  const response = await api.get<ProductsResponse>(
    "/api/v1/catalog/products/",
    {
      params: {
        q: q || undefined,
        category_id: categoryId || undefined,
      },
    }
  );

  return response.data.products;
}

export async function createProduct(formData: FormData): Promise<void> {
  await api.post('/api/v1/catalog/products/', formData)
}

export async function getProduct(productId: number){
  const { data } = await api.get<Product>(
    `/api/v1/catalog/products/${productId}`
  );

  return data;
}

export async function updateProduct(id: number, formData: FormData): Promise<void> {
  await api.patch(`/api/v1/catalog/products/${id}`, formData)
}


export async function getProductVariation(variationId: number) {
  const { data } = await api.get(
    `/api/v1/catalog/products/variations/${variationId}`
  );
  return data;
}
export async function listProductsFavorites(productsIds: number[]){
  const { data } = await api.post<ProductsResponse>(
    `/api/v1/catalog/products/me/favorites`, productsIds
  );

  return data.products;
}


export async function deleteProduct(productId: number): Promise<void> {
  await api.delete(`/api/v1/catalog/products/${productId}`);
}