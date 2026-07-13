import type { Category } from "../../schemas/store";
import { api } from "../client";


export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get(`/api/v1/catalog/stores/categories`);
  return data.categories;
}

