import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(1, 'Username é obrigatório').max(50),
  first_name: z.string().min(1, 'Nome é obrigatório'),
  last_name: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('Email inválido'),
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

export type User = z.infer<typeof userSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>