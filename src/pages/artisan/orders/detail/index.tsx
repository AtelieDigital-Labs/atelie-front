import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import {
  orderArtisanReadSchema,
  VALID_STATUS_TRANSITIONS,
  type OrderArtisanRead,
  type OrderStatus,
} from '../../../../schemas/order'
import { OrderStatusBadge } from '../../../../components/ui/OrderStatusBadge'


const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Aguardando Pagamento',
  PAID: 'Pago',
  PROCESSING: 'Em Processamento',
  SHIPPED: 'Enviado',
  DELIVERED: 'Concluído',
  EXPIRED: 'Expirado',
  REFUSED: 'Recusado',
  CANCELLED: 'Cancelado',
}



const MOCK_ORDER: OrderArtisanRead = {
  order_id: 1,
  status: 'PAID',
  price: 112.0,
  shipping_cost: 0,
  shipping_method: 'Econômico',
  created_at: new Date('2026-01-28T11:41:00'),
  shipping_address: {
    street: 'Rua das Araucarias',
    number: 355,
    complement: 'Casa',
    neighborhood: 'Centro',
    city: 'Pau dos Ferros',
    state: 'RN',
    zip_code: '59900000',
  },
  items: [
    { item_id: 1, product_variant_id: 'Laço Borboleta', quantity: 4, unit_price: 28.0 },
  ],
}

async function mockFetchOrder(orderId: number) {
  return { data: MOCK_ORDER }
}

async function mockUpdateStatus(orderId: number, status: OrderStatus, trackingCode: string | null) {
  return { data: { ...MOCK_ORDER, status } }
}

export function ArtisanOrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<OrderArtisanRead | null>(null)
  const [loading, setLoading] = useState(true)

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('')
  const [trackingCode, setTrackingCode] = useState('')
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return
      try {
        // trocar pela chamada real e remover mockFetchOrder:
        // const { data } = await api.get(`/stores/orders/${orderId}`)
        const { data } = await mockFetchOrder(Number(orderId)) // MOCK
        const parsed = orderArtisanReadSchema.parse(data)
        setOrder(parsed)
      } catch (err) {
        console.error('Erro ao buscar pedido:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-sm text-text/50">Carregando pedido...</p>
      </div>
    )
  }

  const availableTransitions = VALID_STATUS_TRANSITIONS[order.status]
  const canUpdateStatus = availableTransitions.length > 0
  const requiresTrackingCode = selectedStatus === 'SHIPPED'
  const total = order.price + order.shipping_cost

  async function handleUpdateStatus() {
    if (!selectedStatus || !orderId) return

    if (requiresTrackingCode && !trackingCode.trim()) {
      setError('O código de rastreio é obrigatório para o status Enviado.')
      return
    }

    setError('')
    setUpdating(true)

    try {
      // trocar pela chamada real e remover mockUpdateStatus:
      // const { data } = await api.patch(`/stores/orders/${orderId}/status`, {
      //   status: selectedStatus,
      //   tracking_code: requiresTrackingCode ? trackingCode : undefined,
      // })
      const { data } = await mockUpdateStatus(
        Number(orderId),
        selectedStatus,
        requiresTrackingCode ? trackingCode : null
      ) // MOCK

      setOrder(orderArtisanReadSchema.parse(data))
      setSelectedStatus('')
      setTrackingCode('')
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Erro ao atualizar status do pedido.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-card rounded-2xl p-6 flex flex-col gap-6">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Pedido #{order.order_id}</h2>
          <p className="text-xs text-text/50">
            Criado em {order.created_at.toLocaleDateString('pt-BR')}{' '}
            {order.created_at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Endereço de Entrega */}
        <div className="border-t border-primary/10 pt-4">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-primary mb-1">Endereço de Entrega</p>
              <p className="text-sm"><span className="font-medium">Rua:</span> {order.shipping_address.street}, {order.shipping_address.number}</p>
              {order.shipping_address.complement && (
                <p className="text-sm"><span className="font-medium">Complemento:</span> {order.shipping_address.complement}</p>
              )}
              <p className="text-sm"><span className="font-medium">Bairro:</span> {order.shipping_address.neighborhood}</p>
              <p className="text-sm"><span className="font-medium">Cidade/Estado:</span> {order.shipping_address.city} - {order.shipping_address.state}</p>
              <p className="text-sm"><span className="font-medium">CEP:</span> {order.shipping_address.zip_code}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="border-t border-primary/10 pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-primary">Status</p>
            <OrderStatusBadge status={order.status} />
          </div>

          {canUpdateStatus ? (
            <>
              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="border border-primary/20 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  {availableTransitions.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleUpdateStatus}
                  disabled={!selectedStatus || updating}
                  className="bg-success text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-success/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Atualizando...' : 'Atualizar'}
                </button>
              </div>

              {requiresTrackingCode && (
                <div className="flex flex-col gap-1 bg-warning/5 border border-warning/20 rounded-lg p-3">
                  <label className="text-xs font-medium text-warning">
                    Código de Rastreio <span className="text-danger">*</span> — obrigatório para pedidos enviados
                  </label>
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Ex: BR123456789BR"
                    className="border border-primary/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                  />
                </div>
              )}

              {error && <p className="text-xs text-danger">{error}</p>}
            </>
          ) : (
            <p className="text-sm text-text/50">
              Não há mais transições disponíveis para este status.
            </p>
          )}
        </div>

        {/* Itens do pedido */}
        <div className="border-t border-primary/10 pt-4">
          <p className="text-base font-bold text-primary mb-3">Itens do pedido</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-text/50 border-b border-primary/10">
                <th className="pb-2 font-medium">Produto</th>
                <th className="pb-2 font-medium text-center">Qtd</th>
                <th className="pb-2 font-medium text-right">Preço</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.item_id} className="border-b border-primary/5 last:border-0">
                  <td className="py-2">{item.product_variant_id}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">R$ {item.unit_price.toFixed(2)}</td>
                  <td className="py-2 text-right text-primary font-semibold">
                    R$ {(item.unit_price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-3 pt-3 border-t border-primary/10">
            <p className="text-sm font-bold">
              Total: <span className="text-primary">R$ {total.toFixed(2)}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}