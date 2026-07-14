import { useQuery } from "@tanstack/react-query";
import { getIaSummary } from "../../api/ia/summary";

export function useIaSummary(productId: number) {
  return useQuery({
    queryKey: ["summary"],
    queryFn: () => getIaSummary(productId),
  });
}