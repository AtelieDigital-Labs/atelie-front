import { SlidersHorizontal } from 'lucide-react'
import { orderStatusSchema, type OrderStatus } from '../../../../schemas/order'

const TAB_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  REFUSED: 'Recusado',
  PROCESSING: 'Em andamento',
  EXPIRED: 'Expirado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

export type OrderTabKey = 'ALL' | OrderStatus

interface OrderStatusTabsProps {
  active: OrderTabKey
  onChange: (tab: OrderTabKey) => void
}

export function OrderStatusTabs({ active, onChange }: OrderStatusTabsProps) {
  const statuses = orderStatusSchema.options

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onChange('ALL')}
        className={`
          w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors cursor-pointer
          ${active === 'ALL'
            ? 'border-primary bg-primary/5'
            : 'border-primary/10 hover:border-primary/30'
          }
        `}
      >
        <SlidersHorizontal size={16} className={active === 'ALL' ? 'text-primary' : 'text-text/70'} />
      </button>

      {statuses.map((status) => {
        const isActive = active === status

        return (
          <button
            key={status}
            onClick={() => onChange(status)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border
              ${isActive
                ? 'border-primary text-primary bg-primary/5'
                : 'border-primary/10 text-text/70 hover:border-primary/30'
              }
            `}
          >
            {TAB_LABELS[status]}
          </button>
        )
      })}
    </div>
  )
}