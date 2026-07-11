import { api } from "../client";
import type {
  Address,
  AddressCreate
} from "../../schemas/user";

export async function list_addreses(): Promise<Address[]> {
  const response = await api.get<Address[]>(
    "/api/v1/accounts/addresses/",
  );

  return response.data;
}

export async function create_address(data: Address): Promise<Address> {
  const response = await api.post<Address>(
    "/api/v1/accounts/addresses/",
    data
  );

  return response.data;
}

export async function get_address(addressId: number): Promise<Address> {
  const response = await api.post<Address>(
    `/api/v1/accounts/addresses/${addressId}`
  );

  return response.data;
}

export async function update_address(data: AddressCreate, addressId: number): Promise<Address> {
  const response = await api.patch<Address>(
    `/api/v1/accounts/addresses/${addressId}`,
    data
  );

  return response.data;
}

export async function delete_address(addressId: number) {
  const response = await api.delete(
    `/api/v1/accounts/addresses/${addressId}`
  );

  return response.data;
}