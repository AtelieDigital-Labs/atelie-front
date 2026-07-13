import { z } from 'zod'
import type { Product } from './product'

export const addressSchema = z.object({
  street: z.string().min(1, 'Rua é obrigatória').max(255),
  number: z.number().int().positive('Número inválido'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório').max(255),
  city: z.string().min(1, 'Cidade é obrigatória').max(100),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  zip_code: z.string().max(9, 'CEP inválido'),
  complement: z.string().max(255).optional().nullable(),
})

export const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(3).max(150),
})

export const storeCreateSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(150, 'Nome deve ter no máximo 150 caracteres'),
  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional()
    .nullable(),
  category_id: z.number().min(1, 'Selecione uma categoria'),
  image: z.instanceof(FileList).optional().nullable(),
  banner: z.instanceof(FileList).optional().nullable(),
  pix_key: z.string()
    .min(1, 'Chave PIX é obrigatória')
    .max(150),
  address: addressSchema,
})

export const storePublicSchema = z.object({
  id: z.number(),
  artisan_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: categorySchema,
  image: z.string().nullable().optional(),
  banner: z.string().nullable().optional(),
  address: addressSchema.extend({ id: z.number() }).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const addressUpdateSchema = z.object({
  street: z.string().max(255).optional(),
  number: z.number().int().positive().optional(),
  neighborhood: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().length(2).optional(),
  zip_code: z.string().max(9).optional(),
  complement: z.string().max(255).nullable().optional(),
})

export const storeUpdateSchema = z.object({
  description: z.string().max(500).nullable().optional(),
  image: z.instanceof(FileList).nullable().optional(),
  banner: z.instanceof(FileList).nullable().optional(),
  address: addressUpdateSchema.optional(),
})



export type Address = z.infer<typeof addressSchema>
export type Category = z.infer<typeof categorySchema>
export type StoreCreate = z.infer<typeof storeCreateSchema>
export type StorePublic = z.infer<typeof storePublicSchema>
export type AddressUpdate = z.infer<typeof addressUpdateSchema>
export type StoreUpdate = z.infer<typeof storeUpdateSchema>
export interface StoreWithProducts extends StorePublic {
  products: Product[];
}
