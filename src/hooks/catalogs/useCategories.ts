import { useQuery } from "@tanstack/react-query";
import { listCategories } from "../../api/catalogs/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });
}