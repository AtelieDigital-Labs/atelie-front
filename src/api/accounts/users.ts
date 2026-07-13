import type { User } from "../../schemas/auth";
import type { UserUpdate } from "../../schemas/user";
import { api } from "../client";


export async function updateProfile(data: UserUpdate | FormData): Promise<User> {
  const response = await api.patch<User>(
    "/api/v1/accounts/me/",
    data
  );

  return response.data;
}