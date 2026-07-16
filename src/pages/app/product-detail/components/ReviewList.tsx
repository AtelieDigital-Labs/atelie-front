import { useState } from 'react'
import { Stars } from '../../../../components/ui/Stars'
import { ThumbsUp, User } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { ReviewModal } from './ReviewModal'
import { ReviewSummaryAI } from './ReviewSummaryAI'
import { deriveReviewTitle } from '../../../../utils/deriveReviewTitle'
import { useCategories } from '../../../../hooks/catalogs/useCategories'
import { useCreateReview, useReviews } from '../../../../hooks/catalogs/useReviews'
import axios from 'axios'

type Review = {
  id: number
  author: string
  avatar?: string
  date: string
  rating: number
  title: string
  variant?: string
  comment: string
  helpful: number
}

type ReviewSummaryProps = {
  average: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
  onAddReview: () => void
}

interface ReviewListProps {
  productId: number 
  variant?: string | undefined | null 
  currentUserName?: string 
}



function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-card rounded-2xl p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0">
            {review.avatar ? (
              <img src={review.avatar} alt={review.author} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={24} color='gray'/>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{review.author}</p>
            <p className="text-xs text-text/50">{review.date}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Stars rating={review.rating} />
        <span className="text-sm font-semibold text-text">{review.title}</span>
      </div>

      {review.variant && (
        <p className="text-xs text-text/50">Variante: {review.variant}</p>
      )}

      <p className="text-sm text-text/70 leading-relaxed">{review.comment}</p>

      <button className="flex items-center gap-1.5 text-xs text-text/50 hover:text-primary transition-colors w-fit">
        <ThumbsUp size={13} />
        Útil ({review.helpful})
      </button>
    </div>
  )
}

function ReviewSummary({ average, distribution, onAddReview }: ReviewSummaryProps) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0)

  return (
    <div className="flex flex-col gap-4 min-w-48">
      <div className="flex items-end gap-2">
        <span className="text-5xl text-primary font-body font-bold">
          {average.toFixed(1)}
        </span>
        <div className='pb-1 flex flex-col'>
          <Stars rating={average}/>
          <p className='text-xs text-text/50 font-body'>
            {total} avaliações
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        {([5, 4, 3, 2, 1] as const).map(star => {
          const count = distribution[star] ?? 0
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <div key={star} className='flex items-center gap-2'>
              <span className='text-xs text-text/60 w-3 text-right'>{star}</span>
              <div className="flex-1 h-2.5 bg-surface rounded-full overflow-hidden border border-primary/20">
                <div
                  className="h-full bg-warning rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-text/50 w-12 text-right">
                {count} ({pct.toFixed(0)}%)
              </span>
            </div>
          )
        })}
      </div>

      <Button onClick={onAddReview} className="cursor-pointer mt-1" size='md'>
        Adicionar avaliação
      </Button>
    </div>
  )
}

export function ReviewList({ productId, variant, currentUserName }: ReviewListProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const {data:reviews=[]} = useReviews(productId)
  const reviewMutation = useCreateReview()
  // const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const clients_ids = reviews.map(element => {element.id})
  // calcula a média e a distribuição a partir das reviews atuais
  const average = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const distribution = reviews.reduce(
    (acc, review) => {
      const star = review.rating as 1 | 2 | 3 | 4 | 5
      acc[star] = (acc[star] ?? 0) + 1
      return acc
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<1 | 2 | 3 | 4 | 5, number>
  )

  async function handleSubmitReview(rating: number, comment: string) {
    try {
      await reviewMutation.mutateAsync({
        productId: productId,
        review: {
          rating,
          comment,
        },
      });

      setModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ??
          error.response?.data?.message ??
          "Não foi possível enviar sua avaliação.";

        alert(message);
      }
    }
  }

  return (
    // {reviews?.length > 0 && }
    <section className="mt-12 flex flex-col gap-10">

      <div>
        <h2 className="text-2xl mb-6 font-bold">Avaliações dos clientes</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          <ReviewSummary
            average={average}
            distribution={distribution}
            onAddReview={() => setModalOpen(true)}
          />
          <div className='flex flex-col gap-12 flex-1 min-w-0'>
            <ReviewSummaryAI productId={productId} reviewCount={reviews.length} />  
            <div className="flex flex-col gap-4">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

          </div>
        </div>
      </div>

      {modalOpen && (
        <ReviewModal
          variant={variant}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </section>
  )
}