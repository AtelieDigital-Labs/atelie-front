import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create_address, delete_address, get_address, list_addreses, update_address } from "../../api/accounts/addresses";
import type { Address, AddressCreate } from "../../schemas/user";


export function useListAddresses() {
  return useQuery({
    queryKey: ["list-addresses"],
    queryFn: list_addreses,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: create_address,
    onSuccess: (address) => {
      queryClient.setQueryData(["address"], address);
    },
  });
}

export function useGetAddresses(addressId: number) {
  return useQuery({
    queryKey: ["get-address"],
    queryFn: () => get_address(addressId),
     enabled: !!addressId,
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: AddressCreate;
    }) => update_address(data, id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
}

export function useDeleteAddresses() {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. Receba o addressId como argumento da mutationFn
    mutationFn: (addressId: number) => delete_address(addressId),
    
    onSuccess: () => {
      // 2. Invalide a chave onde você lista todos os endereços
      // Altere '["addresses"]' para a queryKey que você usa na sua listagem
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}