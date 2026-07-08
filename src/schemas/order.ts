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
  'SHIPPED',
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

export const orderCreatedSchema = z.object({
  message: z.string(),
  checkout_group_id: z.string(),
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
  created_at: z.coerce.date(), 
  shipping_address: shippingAddressSchema,
  items: z.array(orderItemSchema),
})

export type OrderRead = z.infer<typeof orderReadSchema>

export const orderResponseSchema = z.object({
  order_id: z.number(),
  status: orderStatusSchema,
  created_at: z.iso.datetime(),
})

export type OrderResponseType = z.infer<typeof orderResponseSchema>

export const orderPaymentRequestSchema = z.object({
  checkout_group_id: z.uuid(),
})

export type OrderPaymentRequest = z.infer<typeof orderPaymentRequestSchema>