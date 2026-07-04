import { z } from 'zod'

// Image
export const productImageSchema = z.object({
  id: z.number(),
  url: z.string(),
  is_primary: z.boolean(),
})

export const productImageCreateSchema = z.object({
  url: z.string(),
  is_primary: z.boolean().default(false),
})

export type ProductImage = z.infer<typeof productImageSchema>

// Variation
export const productVariationSchema = z.object({
  id: z.number(),
  price: z.number().positive(),
  weight: z.number().positive(),
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  sku: z.string().max(50).nullable(),
  stock: z.number().int().min(0),
  color: z.string().max(50).nullable(),
  size: z.string().max(50).nullable(),
  images: z.array(productImageSchema),
})

export const productVariationCreateSchema = z.object({
  price: z.number().positive('Preço deve ser maior que 0'),
  weight: z.number().positive('Peso deve ser maior que 0'),
  length: z.number().positive('Comprimento deve ser maior que 0'),
  width: z.number().positive('Largura deve ser maior que 0'),
  height: z.number().positive('Altura deve ser maior que 0'),
  sku: z.string().max(50).nullable().optional(),
  stock: z.number().int().min(0).default(0),
  color: z.string().max(50).nullable().optional(),
  size: z.string().max(50).nullable().optional(),
  images: z.array(productImageCreateSchema).default([]),
})

export type ProductVariation = z.infer<typeof productVariationSchema>
export type ProductVariationCreate = z.infer<typeof productVariationCreateSchema>

// Product 
export const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string(),
  store_id: z.number(),
  is_active: z.boolean(),
  variations: z.array(productVariationSchema),

  // virão de outros endpoints
  shopName: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  monthlySales: z.string().optional(),
  discount: z.number().min(0).max(100).optional(),
  deliveryDate: z.string().optional(),
  freeShipping: z.boolean().optional(),
  fastDelivery: z.boolean().optional(),
  highlights: z.array(z.string()).optional(),
  about: z.string().optional(),
})


export const productCreateSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição deve ter no máximo 255 caracteres'),
  variations: z.array(productVariationCreateSchema)
    .min(1, 'Adicione pelo menos uma variação'),
})

export type Product = z.infer<typeof productSchema>
export type ProductCreate = z.infer<typeof productCreateSchema>