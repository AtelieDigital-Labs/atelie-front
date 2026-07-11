import { useNavigate } from 'react-router-dom'
import { OrderStatusBadge } from '../../../../components/ui/OrderStatusBadge'
import type { OrderResponseType } from '../../../../schemas/order'

interface OrderCardProps {
  order: OrderResponseType
}

export function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/orders/${order.order_id}`)}
      className="bg-card rounded-2xl p-4 flex flex-col gap-1 text-left cursor-pointer hover:border-primary/30 border border-transparent transition-colors w-full"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-sm font-semibold text-primary">
          {order.checkout_group_id}
        </span>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="text-xs text-text/50">
        {order.created_at.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}{' '}
        às{' '}
        {order.created_at.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </button>
  )
}