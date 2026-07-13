import { z } from 'zod'

// espelha CartItemRead
export const cartItemReadSchema = z.object({
  product_variant_id: z.string(),
  store_id: z.string(),
  quantity: z.number().int().positive(),
  unit_price: z.number(),
})

// espelha CartResponse
export const cartResponseSchema = z.object({
  items: z.array(cartItemReadSchema),
  total_quantity: z.number().int(),
  total_price: z.number(),
})

// espelha CartItemCreate
export const cartItemCreateSchema = z.object({
  product_variant_id: z.string(),
  quantity: z.number().int().positive('A quantidade deve ser maior que zero'),
})

// espelha CartItemUpdate
export const cartItemUpdateSchema = z.object({
  quantity: z.number().int().min(0),
})


// espelha CartItemReadUpdated (retorno real de POST /items e PATCH /items/{id})
export const cartItemReadUpdatedSchema = z.object({
  product_variant_id: z.string(),
  quantity: z.number().int(),
  message: z.string(),
})


export type CartItemRead = z.infer<typeof cartItemReadSchema>
export type CartResponse = z.infer<typeof cartResponseSchema>
export type CartItemCreate = z.infer<typeof cartItemCreateSchema>
export type CartItemUpdate = z.infer<typeof cartItemUpdateSchema>
export type CartItemReadUpdated = z.infer<typeof cartItemReadUpdatedSchema>

export type CartItemDisplay = CartItemRead & {
  name: string
  description: string
  shopName: string
  image: string | null
  freeShipping?: boolean
}