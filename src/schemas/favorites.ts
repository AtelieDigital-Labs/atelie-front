import { z } from 'zod'

export const favoriteSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  product_id: z.number(),
})
export const favoriteCreateSchema = z.object({
  user_id: z.string(),
  product_id: z.number(),
})

export const favoriteListSchema = z.object({
  favorites: z.array(favoriteSchema),
})

export type Favorite = z.infer<typeof favoriteSchema>
export type FavoriteCreate = z.infer<typeof favoriteCreateSchema>
export type FavoriteList = z.infer<typeof favoriteListSchema>