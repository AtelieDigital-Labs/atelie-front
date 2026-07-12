import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { reviewSummarySchema, type ReviewSummary } from '../../../../schemas/review'


interface ReviewSummaryAIProps {
  productId: number
  reviewCount: number
}

//MOCK
async function mockFetchReviewSummary(productId: number) {
  return {
    data: {
      content: 'O produto é elogiado pela qualidade do acabamento e pela atenção aos detalhes. Os clientes destacam a rapidez na entrega e recomendam a compra, principalmente para presentes.',
    },
  }
}


export function ReviewSummaryAI({ productId, reviewCount }: ReviewSummaryAIProps) {
  const [data, setData] = useState<ReviewSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (reviewCount === 0) {
      setLoading(false)
      return
    }

    async function fetchSummary() {
      setLoading(true)
      setError(false)
      try {
        // trocar pela chamada real e remover mockFetchReviewSummary:
        // const { data } = await api.get('/reviews/summary/', { params: { product_id: productId } })
        const { data } = await mockFetchReviewSummary(productId) // MOCK

        const parsed = reviewSummarySchema.parse(data)
        setData(parsed)
      } catch (err) {
        console.error('Erro ao buscar resumo de avaliações:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [productId, reviewCount])

  if (loading || error || !data || reviewCount === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-lg font-bold text-text">Opiniões</h3>
        <p className="text-xs text-text/50">{reviewCount} comentários</p>
      </div>

      <p className="text-sm text-text/70 leading-relaxed">
        {data.content}
      </p>

      <div className="flex items-center gap-1.5 text-xs text-primary/70 mt-1 font-bold">
        <Sparkles size={13} />
        <span>Resumo de opiniões gerado por IA</span>
      </div>
    </div>
  )
}