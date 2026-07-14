import { api } from "../client";
import type {
  SignInPayload,
  SignUpPayload,
} from "../../schemas/auth";
import type { User } from "../../schemas/user";

export async function login(data: SignInPayload): Promise<User> {
  const response = await api.post<User>(
    "/api/v1/accounts/login/",
    data,
  );

  return response.data;
}

export async function register(
  data: SignUpPayload,
): Promise<User> {
  const response = await api.post<User>(
    "/api/v1/accounts/register/",
    data,
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>(
    "/api/v1/accounts/me/",
  );

  return response.data;
}

export async function logoutUser(): Promise<null> {
  const response = await api.post(
    "/api/v1/accounts/logout/",
  );

  return null;
}