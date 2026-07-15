import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

type ConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isConfirming?: boolean
  errorMessage?: string | null
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isConfirming = false,
  errorMessage = null
}: ConfirmModalProps) {
  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Bloqueia scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const iconColors = {
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-primary/10 text-primary',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose} // Fecha ao clicar fora
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 fade-in duration-200"
        onClick={e => e.stopPropagation()} // Evita fechar ao clicar dentro
      >
        {/* Ícone */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconColors[variant]}`}>
            <AlertTriangle size={28} />
          </div>

          <h3 className="font-title text-xl font-bold text-text mb-2">
            {title}
          </h3>

          <p className="text-sm text-text/70 leading-relaxed">
          {message}
          </p>

           {errorMessage && (
                <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2 mt-3 w-full">
                {errorMessage}
                </p>
            )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isConfirming}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Excluindo...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}