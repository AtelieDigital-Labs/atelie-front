import { useNavigate } from 'react-router-dom'
import { OrderStatusBadge } from '../../../../components/ui/OrderStatusBadge'
import type { OrderResponseType } from '../../../../schemas/order'

interface OrderCardProps {
  order: OrderResponseType
}

export function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate()

  // Converte a string da API em um objeto Date do JavaScript
  const dateInstance = new Date(order.created_at)

  // Validação preventiva: caso a data seja inválida (ex: string vazia ou nula)
  const isValidDate = !isNaN(dateInstance.getTime())

  return (
    <button
      onClick={() => navigate(`/orders/${order.order_id}`)}
      className="bg-card rounded-2xl p-4 flex flex-col gap-1 text-left cursor-pointer hover:border-primary/30 border border-transparent transition-colors w-full"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-sm font-semibold text-primary">
          {order.order_id}
        </span>
        <OrderStatusBadge status={order.status} />
      </div>
      
      <p className="text-xs text-text/50">
        {isValidDate ? (
          <>
            {dateInstance.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}{' '}
            às{' '}
            {dateInstance.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </>
        ) : (
          'Data indisponível'
        )}
      </p>
    </button>
  )
}