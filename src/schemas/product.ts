import { z } from 'zod'

// ProductImage
export const productImageSchema = z.object({
  id: z.number(),
  url: z.string().pipe(z.url()),
  is_primary: z.boolean(),
})

export type ProductImage = z.infer<typeof productImageSchema>

// ProductVariation
export const productVariationSchema = z.object({
  id: z.number(),
  price: z.number().positive(),
  weight: z.number(),
  length: z.number(),
  width: z.number(),
  height: z.number(),
  sku: z.string().nullable(),
  stock: z.number().int().min(0),
  color: z.string().nullable(),
  size: z.string().nullable(),
  images: z.array(productImageSchema),
})

export type ProductVariation = z.infer<typeof productVariationSchema>

// Product
export const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string(),
  store_id: z.number(),
  is_active: z.boolean(),
  variations: z.array(productVariationSchema),

  // Campos opcionais (virão de outros endpoints)
  shopName: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  monthlySales: z.string().optional(),
  discount: z.number().min(0).max(100).optional(),
  deliveryDate: z.string().optional(),
  freeShipping: z.boolean().optional(),
  fastDelivery: z.boolean().optional(),

  // Detalhes do produto
  highlights: z.array(z.string()).optional(),
  about: z.string().optional(),
})

export type Product = z.infer<typeof productSchema>