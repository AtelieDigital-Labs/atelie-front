import { useState } from 'react'
import { Star } from 'lucide-react'

type StarsProps = {
  rating: number
  reviewCount?: number
  maxStars?: number
  size?: number
  onChange?: (value: number) => void // se informado, as estrelas ficam clicáveis
}

export function Stars({ rating, reviewCount, maxStars = 5, size = 12, onChange }: StarsProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const isInteractive = typeof onChange === 'function'
  const displayRating = isInteractive && hovered !== null ? hovered : rating

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-warning">
        {Array.from({ length: maxStars }).map((_, i) => {
          const starValue = i + 1
          const filled = i < Math.floor(displayRating)
          const partial = !filled && i < displayRating

          const star = (
            <div key={i} className="relative">
              <Star size={size} className="text-primary/20" fill="currentColor" />
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${(displayRating % 1) * 100}%` }}
                >
                  <Star size={size} className="text-warning" fill="currentColor" />
                </div>
              )}
            </div>
          )

          if (!isInteractive) return star

          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHovered(starValue)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-transform hover:scale-110"
              aria-label={`${starValue} estrela${starValue > 1 ? 's' : ''}`}
            >
              {star}
            </button>
          )
        })}
      </div>

      {reviewCount !== undefined && (
        <span className="text-xs text-text/60">{reviewCount}</span>
      )}
    </div>
  )
}