import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type CarouselProps = {
  children: ReactNode[]
  itemClassName?: string
  gapClassName?: string
  className?: string
}

export function Carousel({
  children,
  itemClassName = 'w-full sm:w-1/2 lg:w-1/3 xl:w-1/4',
  gapClassName = 'gap-6',
  className = '',
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanScrollPrev(el.scrollLeft > 4)
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = trackRef.current
    if (!el) return

    el.addEventListener('scroll', updateArrows, { passive: true })
    const resizeObserver = new ResizeObserver(updateArrows)
    resizeObserver.observe(el)

    return () => {
      el.removeEventListener('scroll', updateArrows)
      resizeObserver.disconnect()
    }
  }, [updateArrows])

  function scrollByPage(direction: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className={`relative min-w-0 group ${className}`}>
      
      <div className="min-w-0 overflow-hidden">
        <div
          ref={trackRef}
          className={`flex ${gapClassName} overflow-x-auto scroll-smooth snap-x snap-mandatory
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
        >
          {children.map((child, index) => (
            <div key={index} className={`${itemClassName} shrink-0 snap-start`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollByPage(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 rounded-full bg-card border border-white/10 shadow-lg
                     flex items-center justify-center text-text/70
                     opacity-0 group-hover:opacity-100 transition-opacity
                     cursor-pointer hover:text-primary hover:bg-surface"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {canScrollNext && (
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => scrollByPage(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 rounded-full bg-card border border-white/10 shadow-lg
                     flex items-center justify-center text-text/70
                     opacity-0 group-hover:opacity-100 transition-opacity
                     cursor-pointer hover:text-primary hover:bg-surface"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  )
}