import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className=" cursor-pointer p-2 rounded-xl text-text/50 hover:text-primary hover:bg-card transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-9 h-9 rounded-xl text-sm font-medium transition-colors cursor-pointer
            ${currentPage === page
              ? 'bg-primary text-white'
              : 'text-text/60 hover:text-primary hover:bg-card'
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl text-text/50 hover:text-primary hover:bg-card transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}