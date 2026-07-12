import { useState, useEffect, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { Stars } from '../../../../components/ui/Stars'
import { Button } from '../../../../components/ui/Button'

interface ReviewModalProps {
  variant?: string | null
  onClose: () => void
  onSubmit: (rating: number, comment: string) => void
}

export function ReviewModal({ variant, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Bloqueia scroll do body enquanto o modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (rating === 0) {
      setError('Selecione uma quantidade de estrelas.')
      return
    }
    if (!comment.trim()) {
      setError('Escreva um comentário sobre o produto.')
      return
    }

    setError('')
    setSubmitting(true)

    // substituir por chamada real na api
    await onSubmit(rating, comment.trim())

    setSubmitting(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4 animate-in zoom-in-95 fade-in duration-200"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-title text-xl font-bold text-text">Avaliar produto</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text/40 hover:text-text transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {variant && (
          <p className="text-xs text-text/50 -mt-2">Avaliando variante: <span className="font-medium">{variant}</span></p>
        )}

        <div className="flex flex-col items-center gap-2 py-2">
          <p className="text-sm text-text/60">Sua avaliação</p>
          <Stars rating={rating} onChange={setRating} size={28} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-comment" className="text-sm font-medium text-text/70">
            Comentário
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte sua experiência com o produto..."
            rows={4}
            className="border border-primary/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none bg-white"
          />
        </div>

        {error && <p className="text-xs text-danger" role="alert">{error}</p>}

        <div className="flex gap-2 mt-1">
          <Button type="button" variant="danger" fullWidth onClick={onClose} disabled={submitting} className="cursor-pointer">
            Cancelar
          </Button>
          <Button type="submit" fullWidth disabled={submitting} 
          variant='success'
          className="cursor-pointer">
            {submitting ? 'Enviando...' : 'Enviar avaliação'}
          </Button>
        </div>
      </form>
    </div>
  )
}