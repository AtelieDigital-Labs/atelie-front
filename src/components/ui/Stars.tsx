import { Star } from 'lucide-react'

type StarsProps = {
  rating: number
  reviewCount?: number
  maxStars?: number
}

export function Stars({ rating, reviewCount, maxStars = 5 }: StarsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-warning">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating)
          const partial = !filled && i < rating

          return (
            <div key={i} className="relative">
              <Star size={12} className="text-primary/20" fill="currentColor" />
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
                >
                  <Star size={12} className="text-warning" fill="currentColor" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {reviewCount !== undefined && (
        <span className="text-xs text-text/60">{reviewCount}</span>
      )}
    </div>
  )
}