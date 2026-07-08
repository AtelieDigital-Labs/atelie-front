import { z } from 'zod'

export const shippingOptionSchema = z.object({
  name: z.string(),
  total_price: z.number(),
  max_delivery_time: z.number().int(),
  stores_breakdown: z.record(z.string(), z.number()),
})

export const cartShippingResponseSchema = z.object({
  cheapest: shippingOptionSchema,
  fastest: shippingOptionSchema,
})

export type ShippingOption = z.infer<typeof shippingOptionSchema>
export type CartShippingResponse = z.infer<typeof cartShippingResponseSchema>