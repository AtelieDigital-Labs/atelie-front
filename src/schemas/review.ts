import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).nullable().optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>

export const reviewPublicSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  product_id: z.number(),
  rating: z.number(),
  comment: z.string().nullable(),
})

export type ReviewPublic = z.infer<typeof reviewPublicSchema>

export const reviewListSchema = z.object({
  reviews: z.array(reviewPublicSchema),
  total: z.number(),
  average_rating: z.number(),
})

export type ReviewListResponse = z.infer<typeof reviewListSchema>

export const reviewUpdateSchema = z.object({
  rating: z.number().int().min(1).max(5).nullable().optional(),
  comment: z.string().max(500).nullable().optional(),
})

export type ReviewUpdate = z.infer<typeof reviewUpdateSchema>

// resumo de IA — GET /reviews/summary/?product_id={id}
export const reviewSummarySchema = z.object({
  content: z.string(),
})

export type ReviewSummary = z.infer<typeof reviewSummarySchema>