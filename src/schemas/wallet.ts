import { z } from 'zod'

export const walletSchema = z.object({
  id: z.number(),
  user: z.number(), // FK pro usuário — ajustar tipo se o serializer devolver objeto em vez de ID
  balance: z.coerce.number(),
  pix_key: z.string().nullable(),
})

export type Wallet = z.infer<typeof walletSchema>