import { useQuery } from "@tanstack/react-query";
import { getShippingOptions } from "../../api/orders/checkout";

export function useShippingOptions(addressId: string | undefined) {
  return useQuery({
    queryKey: ["shipping-options", addressId],
    queryFn: () => getShippingOptions(addressId!),
    enabled: !!addressId,
  });
}