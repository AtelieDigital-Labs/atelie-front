import type { OrderStatus } from '../../schemas/order'

const STATUS_LABELS: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'PENDENTE', className: 'bg-warning/20 text-warning' },
  PAID: { label: 'PAGO', className: 'bg-success/20 text-success' },
  PROCESSING: { label: 'EM PROCESSAMENTO', className: 'bg-primary/20 text-primary' },
  SHIPPED: { label: 'ENVIADO', className: 'bg-primary/20 text-primary' },
  DELIVERED: { label: 'ENTREGUE', className: 'bg-success/20 text-success' },
  EXPIRED: { label: 'EXPIRADO', className: 'bg-danger/20 text-danger' },
  REFUSED: { label: 'RECUSADO', className: 'bg-danger/20 text-danger' },
  CANCELLED: { label: 'CANCELADO', className: 'bg-danger/20 text-danger' },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  const info = STATUS_LABELS[status]

  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${info.className} ${className}`}
    >
      {info.label}
    </span>
  )
}