import { useParams, useNavigate } from 'react-router-dom'
import { Check, Store, RefreshCw, Clock, X, Package } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { OrderStatusBadge } from '../../../../components/ui/OrderStatusBadge'
import { type OrderStatus } from '../../../../schemas/order'
import { useOrder, useRetryPayment } from '../../../../hooks/orders/useOrders' // Ajuste o caminho para o seu hook

const HEADER_CONTENT: Record<OrderStatus, { icon: typeof Check; iconBg: string; iconColor: string; title: string }> = {
  PENDING: { icon: Clock, iconBg: 'bg-warning/10', iconColor: 'text-warning', title: 'Aguardando Pagamento' },
  PAID: { icon: Check, iconBg: 'bg-success/10', iconColor: 'text-success', title: 'Pedido Recebido' },
  PROCESSING: { icon: Package, iconBg: 'bg-primary/10', iconColor: 'text-primary', title: 'Pedido em Preparação' },
  SHIPPED: { icon: Package, iconBg: 'bg-primary/10', iconColor: 'text-primary', title: 'Pedido Enviado' },
  DELIVERED: { icon: Check, iconBg: 'bg-success/10', iconColor: 'text-success', title: 'Pedido Entregue' },
  EXPIRED: { icon: Clock, iconBg: 'bg-warning/10', iconColor: 'text-warning', title: 'Pagamento Expirado' },
  REFUSED: { icon: X, iconBg: 'bg-danger/10', iconColor: 'text-danger', title: 'Pagamento Recusado' },
  CANCELLED: { icon: X, iconBg: 'bg-danger/10', iconColor: 'text-danger', title: 'Pedido Cancelado' },
}

export function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  // Queries e Mutations do TanStack Query
  const { data: order, isLoading: loading, isError } = useOrder(orderId ? Number(orderId) : undefined)
  const { mutate: triggerRetryPayment, isPending: generatingPix } = useRetryPayment()

  function handleGerarPix() {
    if (!order) return

    triggerRetryPayment(order.checkout_group_id, {
      onSuccess: (data) => {
        navigate('/checkout/payment', {
          state: {
            payment_info: data.payment_info,
            order_ids: data.order_ids,
            checkout_group_id: data.checkout_group_id,
          },
        })
      },
      onError: (error: any) => {
        navigate('/checkout/payment-error', {
          state: {
            message: error?.response?.data?.detail ?? 'Erro ao gerar o pagamento.',
          },
        })
      },
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-sm text-text/50">Carregando pedido...</p>
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-sm text-danger font-medium">Erro ao carregar os detalhes do pedido.</p>
        <Button variant="secondary" onClick={() => navigate('/orders/list')}>
          Voltar para meus pedidos
        </Button>
      </div>
    )
  }

  // const total = Number(order.price) + Number(order.shipping_cost)
  const total = Number(order.price)

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-2xl p-6 flex flex-col gap-6">

      {/* Header */}
      {(() => {
        const header = HEADER_CONTENT[order.status]
        const HeaderIcon = header.icon

        return (
          <div className="flex flex-col items-center gap-1 text-center">
            <div className={`w-24 h-24 rounded-full ${header.iconBg} flex items-center justify-center`}>
              <HeaderIcon className={header.iconColor} size={44} />
            </div>
            <h2 className="text-lg font-bold text-text">{header.title}</h2>
            <p className="text-xs text-text/50">
              {new Date(order.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <span className="bg-surface rounded-full px-3 py-1 text-xs text-text/60 font-mono mt-1">
              #{order.checkout_group_id}
            </span>
          </div>
        )
      })()}

      <div className="border-t border-primary/10 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store size={16} className="text-primary" />
          <p className="text-sm text-text">
            Vendido por <span className="font-semibold">{order.store_id}</span>
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-3">
        {order.items.map((item) => (
          <div key={item.item_id} className="flex justify-between text-sm gap-3">
            <div>
              <p className="text-text font-medium">{item.product_variant_id}</p>
              <p className="text-xs text-text/50">Qtd: {item.quantity}</p>
            </div>
            <span className="text-text/70 shrink-0">{item.unit_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-primary/10 pt-6 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-[10px] text-text/40 uppercase mb-1">Endereço de Entrega</p>
          <p className="text-text/70">{order.shipping_address.street}, {order.shipping_address.number}</p>
          <p className="text-text/70">{order.shipping_address.neighborhood}</p>
          <p className="text-text/70">{order.shipping_address.city} - {order.shipping_address.state}</p>
        </div>
        <div>
          <p className="text-[10px] text-text/40 uppercase mb-1">Pagamento</p>
          <p className="text-text/70">Via {order.payment_method.toUpperCase()}</p>
          <p className="text-text/70">Total: {total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</p>
        </div>
      </div>

      <div className="border-t border-primary/10 pt-6 flex flex-col gap-1">
        <div className="flex justify-between text-sm text-text/60">
          <span>Subtotal</span>
          <span>{order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-text">
          <span>Total</span>
          <span className="text-primary">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL',  })}</span>
        </div>
      </div>

      {/* Botão condicional - aparece se PENDING ou EXPIRED */}
      { order.status === 'PENDING' && (
        <div className="flex flex-col gap-3">
          <div className="bg-warning/10 rounded-xl p-3 flex items-start gap-2 text-left">
            <RefreshCw size={16} className="text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-warning font-medium">
                Este pedido ainda não foi pago. Clique em "Gerar PIX" abaixo para exibir o código de pagamento.
            </p>
          </div>
      
          <div className='flex flex-col gap-3 px-12'>
            <Button
              fullWidth
              onClick={handleGerarPix}
              disabled={generatingPix}
              className="cursor-pointer"
            >
              {generatingPix ? 'Gerando PIX...' : 'Gerar PIX'}
            </Button>
          </div>
        </div>
      )}

      <div className='flex flex-col gap-3 px-12'>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/orders/list')}
          className="cursor-pointer"
        >
          Acompanhar Meus Pedidos
        </Button>
      </div>

    </div>
  )
}