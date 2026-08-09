import {Stars} from '../../../../components/ui/Stars'
import { ThumbsUp, User } from 'lucide-react'

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
}


const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Mariana Costa',
    date: '02/06/2026',
    rating: 5,
    title: 'Perfeito para festas!',
    variant: 'Rosa Bebê',
    comment: 'Comprei o laço rosa bebê para o aniversário de 3 anos da minha filha. A qualidade do cetim é incrível, não fica marcado e o bico de pato é super seguro. Chegou antes do prazo e a embalagem estava linda, ótimo para presentear.',
    helpful: 24,
  },
  {
    id: 2,
    author: 'Ana Paula Ribeiro',
    date: '28/05/2026',
    rating: 5,
    title: 'Artesanal de verdade',
    variant: 'Marfim',
    comment: 'Dá pra ver que é feito à mão com carinho. As pérolas são bem colocadas e o acabamento é impecável. Já comprei em 3 cores diferentes e todos são maravilhosos.',
    helpful: 18,
  },
  {
    id: 3,
    author: 'Fernanda Lima',
    date: '15/05/2026',
    rating: 3,
    title: 'Lindo, mas demorou um pouco',
    variant: 'Terracota',
    comment: 'O laço é exatamente como na foto, muito delicado. Só achei que a produção demorou 5 dias ao invés dos 3 prometidos. Mas valeu a espera, é uma peça única.',
    helpful: 7,
  },
]


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

function ReviewSummary({average, distribution}: ReviewSummaryProps){
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0)

  return(
    <div className="flex flex-col gap-4 min-w-48">
      {/* Nota média */}
      <div className="flex items-end gap-2">
        <span className="font-title text-5xl text-primary">
          {average.toFixed(1)}
        </span>
        <div className='pb-1 flex flex-col'>
          <Stars rating={average}/>
          <p className='text-xs text-text/50'>
            {total} avaliações
          </p>
        </div>
      </div>

      {/* Barras de distribuição */}
      <div className='flex flex-col gap-2'>
        { ([5,4,3,2,1] as const).map(star =>{
          const count = distribution[star] ?? 0
          const pct = total > 0 ?  (count/total) * 100 : 0
          return(
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
    </div>
  )
}

export function ReviewList(){
  return(
    <section className="mt-12">
      <h2 className="text-2xl mb-6 font-bold">Avaliações dos clientes</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <ReviewSummary
          average={5.0}
          distribution={{ 5: 4, 4: 1, 3: 0, 2: 0, 1: 0 }}
        />

       <div className="flex flex-col gap-4 flex-1">
          {MOCK_REVIEWS.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

      </div>

    </section>
  )
}