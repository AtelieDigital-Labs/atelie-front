import { useQueries } from "@tanstack/react-query";
import { useCart } from "./useCart";
import { getProductVariation, getProduct } from "../../api/catalogs/products";
import { getStore } from "../../api/catalogs/stores";
import type { CartItemDisplay } from "../../schemas/cart";

export function useCartWithDetails() {
  const { data: cart, isPending: isCartPending, error: cartError } = useCart();

  const variationQueries = useQueries({
    queries: (cart?.items ?? []).map((item) => ({
      queryKey: ["product-variation", item.product_variant_id],
      queryFn: () => getProductVariation(Number(item.product_variant_id)),
      enabled: !!cart,
    })),
  });

  const productQueries = useQueries({
    queries: variationQueries.map((vq) => ({
      queryKey: ["product", vq.data?.product_id],
      queryFn: () => getProduct(vq.data!.product_id),
      enabled: !!vq.data?.product_id,
    })),
  });

  const storeQueries = useQueries({
    queries: variationQueries.map((vq) => ({
      queryKey: ["store", vq.data?.store_id],
      queryFn: () => getStore(vq.data!.store_id),
      enabled: !!vq.data?.store_id,
    })),
  });

  const isPending =
  isCartPending ||
  variationQueries.some((q) => q.isPending) ||
  productQueries.some((q) => q.isLoading) ||   
  storeQueries.some((q) => q.isLoading);      

  const error =
    cartError ??
    variationQueries.find((q) => q.error)?.error ??
    productQueries.find((q) => q.error)?.error ??
    storeQueries.find((q) => q.error)?.error;

  const items: CartItemDisplay[] = (cart?.items ?? []).map((item, index) => {
    const variation = variationQueries[index]?.data;
    const product = productQueries[index]?.data;
    const store = storeQueries[index]?.data;

    const matchingVariation = product?.variations?.find(
      (v: any) => v.id === variation?.id
    );

    return {
      ...item,
      name: product?.name ?? "",
      description: product?.description ?? "",
      shopName: store?.name ?? "",
      image:
        matchingVariation?.images?.find((img: any) => img.is_primary)?.url ??
        matchingVariation?.images?.[0]?.url ??
        null,
    };
  });

  return {
    items,
    total_quantity: cart?.total_quantity ?? 0,
    total_price: cart?.total_price ?? 0,
    isPending,
    error,
  };
}