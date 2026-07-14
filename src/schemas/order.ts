import { z } from 'zod'

export const shippingAddressSchema = z.object({
  street: z.string(),
  number: z.union([z.string(), z.number()]),
  complement: z.string().nullable().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
})

export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export const orderItemSchema = z.object({
  item_id: z.number(),
  product_variant_id: z.string(),
  quantity: z.number(),
  unit_price: z.coerce.number(),
})

export type OrderItem = z.infer<typeof orderItemSchema>

export const paymentInfoSchema = z.object({
  id: z.string(),
  qr_code_base64: z.string(),
  qr_code: z.string(),
  expires_at: z.coerce.date().nullable().optional(),
})

export type PaymentInfo = z.infer<typeof paymentInfoSchema>

export const orderStatusSchema = z.enum([
  'PENDING',
  'PAID',
  'PROCESSING',
  'REFUSED',
  'SHIPPED',
  'EXPIRED',
  'DELIVERED',
  'CANCELLED',
])

export type OrderStatus = z.infer<typeof orderStatusSchema>

export const orderCheckoutRequestSchema = z.object({
  address_id: z.string(),
  payment_method: z.literal('pix').default('pix'),
  shipping_method: z.string(),
})

export type OrderCheckoutRequest = z.infer<typeof orderCheckoutRequestSchema>

// resposta do POST /orders — order_ids depende do ajuste no backend
export const orderCreatedSchema = z.object({
  message: z.string(),
  checkout_group_id: z.string(),
  order_ids: z.array(z.number()),
  payment_info: paymentInfoSchema,
})

export type OrderCreated = z.infer<typeof orderCreatedSchema>

export const orderReadSchema = z.object({
  order_id: z.number(),
  status: orderStatusSchema,
  price: z.coerce.number(),
  shipping_cost: z.coerce.number(),
  shipping_method: z.string(),
  tracking_code: z.string().nullable().optional(),
  payment_method: z.string(),
  store_id: z.string(),
  checkout_group_id: z.string(),
  created_at: z.coerce.date(),
  shipping_address: shippingAddressSchema,
  items: z.array(orderItemSchema),
})

export type OrderRead = z.infer<typeof orderReadSchema>

// grupo de pedidos = simplesmente um array de OrderRead,
// buscado individualmente via GET /orders/{order_id} para cada order_id do grupo.
// Não precisa de schema novo nem de rota de agrupamento no backend.
export type OrderGroup = OrderRead[]

export const orderResponseSchema = z.object({
  order_id: z.number(),
  status: orderStatusSchema,
  checkout_group_id: z.string(),
  created_at: z.coerce.date(),
})

export type OrderResponseType = z.infer<typeof orderResponseSchema>

export const orderPaymentRequestSchema = z.object({
  checkout_group_id: z.uuid(),
})

export type OrderPaymentRequest = z.infer<typeof orderPaymentRequestSchema>

// wrapper genérico de paginação do fastapi_pagination
export const pageSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    size: z.number(),
    pages: z.number(),
  })

export const ordersPageSchema = pageSchema(orderResponseSchema)
export type OrdersPage = z.infer<typeof ordersPageSchema>

// PARA PEDIDOS DO ARTESÃO 


export const orderArtisanReadSchema = z.object({
  order_id: z.number(),
  status: orderStatusSchema,
  price: z.coerce.number(),
  created_at: z.coerce.date(),
  shipping_cost: z.coerce.number(),
  shipping_method: z.string(),
  shipping_address: shippingAddressSchema,
  items: z.array(orderItemSchema),
})

export type OrderArtisanRead = z.infer<typeof orderArtisanReadSchema>

// PATCH /stores/orders/{order_id}/status — corpo da requisição
export const orderArtisanStatusUpdateSchema = z.object({
  status: orderStatusSchema,
  tracking_code: z.string().nullable().optional(),
})

export type OrderArtisanStatusUpdate = z.infer<typeof orderArtisanStatusUpdateSchema>

export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [],
  PAID: ['PROCESSING', 'SHIPPED', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  REFUSED: [],
  EXPIRED: [],
  DELIVERED: [],
  CANCELLED: [],
}
export const orderArtisanSummarySchema = z.object({
  order_id: z.number(),
  status: orderStatusSchema,
  price: z.coerce.number(),
  created_at: z.coerce.date(),
})

export type OrderArtisanListItem = z.infer<typeof orderArtisanSummarySchema>

export const orderArtisanPageSchema = pageSchema(orderArtisanSummarySchema)
export type OrderArtisanPage = z.infer<typeof orderArtisanPageSchema>
export type OrderArtisanSummary = z.infer<typeof orderArtisanSummarySchema>

// Envelopa o resumo no schema de paginação genérico que você já possui
export const artisanOrdersPageSchema = pageSchema(orderArtisanSummarySchema)
export type ArtisanOrdersPage = z.infer<typeof artisanOrdersPageSchema>
