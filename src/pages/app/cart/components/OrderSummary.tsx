import { Button } from '../../../../components/ui/Button'

type OrderSummaryProps = {
  subtotal: number
  shipping: number | null
  onContinue: () => void
  onAddProducts?: () => void
  continueLabel?: string
  loading?: boolean
}

export function OrderSummary({
  subtotal,
  shipping,
  onContinue,
  onAddProducts,
  continueLabel = 'Continuar',
  loading = false,
}: OrderSummaryProps) {
  const total = subtotal + (shipping ?? 0)

  return (
    <div className="bg-card rounded-2xl p-6 flex flex-col gap-4 w-full lg:w-80 lg:sticky lg:top-4">
      <h3 className="font-title text-lg text-primary font-bold">Resumo do Pedido</h3>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text/60">Subtotal</span>
          <span className="font-medium">
            R$ {subtotal.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text/60">Frete</span>
          <span className={shipping === 0 ? 'text-success font-medium' : 'font-medium'}>
            {shipping === null
              ? 'A calcular'
              : shipping === 0
                ? 'Grátis'
                : `R$ ${shipping.toFixed(2).replace('.', ',')}`
            }
          </span>
        </div>
      </div>

      <div className="border-t border-primary/10 pt-3 flex items-center justify-between">
        <span className="font-semibold text-text">Total</span>
        <span className="text-xl text-primary font-bold">
          R$ {total.toFixed(2).replace('.', ',')}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Button 
          fullWidth size="md" 
          variant="success" 
          onClick={onContinue}
          disabled={loading}
          >
          {loading ? 'Processando...' : continueLabel}
        </Button>
        {onAddProducts && (
          <Button fullWidth size="md" variant="primary" onClick={onAddProducts}>
            Adicionar produtos
          </Button>
        )}
      </div>
    </div>
  )
}