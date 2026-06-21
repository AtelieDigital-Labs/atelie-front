import { z } from 'zod'


export const userSchema = z.object({
  pk: z.number(),
  email: z.string().pipe(z.email('Email inválido')),
  username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
  first_name: z.string(),
  last_name: z.string(),
  is_artisan: z.boolean(),
})

export type User = z.infer<typeof userSchema>

export const authResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user: userSchema,
})

export type AuthResponse = z.infer<typeof authResponseSchema>


export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .pipe(z.email({ message: 'Email inválido' })),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória' })
    .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
})

export type SignInPayload = z.infer<typeof signInSchema>


export const signUpSchema = z
  .object({
    first_name: z
      .string()
      .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
    last_name: z
      .string()
      .min(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres' }),
    username: z
      .string()
      .min(3, { message: 'Username deve ter pelo menos 3 caracteres' })
      .regex(/^[a-zA-Z0-9_]+$/, { 
        message: 'Username só pode conter letras, números e _' 
      }),
    email: z
      .string()
      .min(1, { message: 'Email é obrigatório' })
      .pipe(z.email({ message: 'Email inválido' })),
    cpf: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || val.replace(/\D/g, '').length === 11,
        { message: 'CPF deve ter 11 dígitos' }
      ),
    phone_number: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || val.replace(/\D/g, '').length >= 10,
        { message: 'Telefone deve ter pelo menos 10 dígitos' }
      ),
    date_of_birth: z
      .string()
      .optional()
      .or(z.literal('')),
    password1: z
      .string()
      .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Senha deve conter maiúscula, minúscula e número',
      }),
    password2: z.string().min(1, { message: 'Confirme sua senha' }),
  })
  .refine(data => data.password1 === data.password2, {
    message: 'As senhas não coincidem',
    path: ['password2'],
  })


export type SignUpPayload = z.infer<typeof signUpSchema>