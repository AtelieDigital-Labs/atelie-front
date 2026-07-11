import type { Favorite, FavoriteCreate, FavoriteList } from "../../schemas/favorites";
import { api } from "../client";

export async function getFavorites() {
    const response = await api.get<FavoriteList>("/api/v1/catalog/favorites/");
    return response.data.favorites;
}

export async function createIsFavorites(id: number) {
    const response = await api.post<Favorite>(`/api/v1/catalog/favorites/${id}`);
    return response.data;
}

export async function getIsFavorites() {
    const response = await api.get<FavoriteList>("/api/v1/catalog/favorites/");
    return response.data.favorites;
}