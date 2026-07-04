import { z } from 'zod'


export const addressSchema = z.object({
  id: z.number(),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.number().int().positive('Número inválido'),
  complement: z.string().nullable().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  zip_code: z.string().length(8, 'CEP deve ter 8 dígitos'),
  is_main: z.boolean(),
})

export const addressCreateSchema = addressSchema.omit({ id: true })


export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(1, 'Username é obrigatório').max(50),
  first_name: z.string().min(1, 'Nome é obrigatório'),
  last_name: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.email('Email inválido'),
  bio: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  profile_image: z.string().nullable().optional(),
  is_artisan: z.boolean(),
})

export const userUpdateSchema = userSchema
  .omit({ id: true, is_artisan: true, cpf: true })
  .partial()

export type Address = z.infer<typeof addressSchema>
export type AddressCreate = z.infer<typeof addressCreateSchema>
export type User = z.infer<typeof userSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>