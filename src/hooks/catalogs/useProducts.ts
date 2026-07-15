// hooks/catalog/useProducts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listProducts, getProduct, listProductsFavorites, listProductsSearch, updateProduct, createProduct, deleteProduct } from "../../api/catalogs/products";



export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });
}

export function useProductsSearch(
  q?: string,
  categoryId?: number
) {
  return useQuery({
    queryKey: ["products-search", q, categoryId],
    queryFn: () => listProductsSearch(q, categoryId),
    staleTime: 60 * 1000,
  });
}

export function useProduct(id?: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: !!id && !isNaN(id),
  })
}

/**
 * Mutation para cadastro de produto.
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

/**
 * Mutation para edição de produto.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateProduct(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
  })
}

export function useProductsFavorites(ids: number[]) {
  return useQuery({
    queryKey: ["product-favorites", ids],
    queryFn: () => listProductsFavorites(ids),
    enabled: ids.length > 0,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['store-products'] })
    },
  })
}