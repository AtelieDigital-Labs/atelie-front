import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { MapPin, Loader2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  VALID_STATUS_TRANSITIONS,
  type OrderStatus,
} from '../../../../schemas/order'
import { OrderStatusBadge } from '../../../../components/ui/OrderStatusBadge'
import { useGetStoreOrder, useUpdateStoreOrderStatus } from '../../../../hooks/orders/useOrders'

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

export function ArtisanOrderDetailPage() {
  const { orderId } = useParams()

  // 1. Queries e Mutations do React Query (Adeus useEffect e Mocks!)
  const { data: order, isLoading, error: fetchError } = useGetStoreOrder(orderId)
  const { mutateAsync: updateStatus, isPending: updating } = useUpdateStoreOrderStatus()

  // 2. Estados locais estritamente para controle dos inputs do formulário
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('')
  const [trackingCode, setTrackingCode] = useState('')
  const [formError, setFormError] = useState('')

  // 3. Tratamento de carregamento da página inteira
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-2">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm text-text/50">Carregando detalhes do pedido...</p>
      </div>
    )
  }

  // 4. Tratamento de erro caso o pedido não exista ou o servidor caia
  if (fetchError || !order) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-sm text-danger font-medium">Erro ao carregar o pedido ou pedido não encontrado.</p>
        <Link to="/artisan/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Voltar para a listagem
        </Link>
      </div>
    )
  }

  // Regras de negócio derivadas do seu Zod Schema
  const availableTransitions = VALID_STATUS_TRANSITIONS[order.status] ?? []
  const canUpdateStatus = availableTransitions.length > 0
  const requiresTrackingCode = selectedStatus === 'SHIPPED'
  const total = order.price + order.shipping_cost

  // Função disparada ao submeter a alteração de status
  async function handleUpdateStatus() {
    if (!selectedStatus || !orderId) return

    if (requiresTrackingCode && !trackingCode.trim()) {
      setFormError('O código de rastreio é obrigatório para o status Enviado.')
      return
    }

    setFormError('')

    try {
      // Dispara a mutação enviando o ID convertido estritamente em número
      await updateStatus({
        orderId: Number(orderId),
        status: selectedStatus,
        trackingCode: requiresTrackingCode ? trackingCode : null
      })

      // Reseta o formulário após o sucesso
      setSelectedStatus('')
      setTrackingCode('')
    } catch (err: any) {
      setFormError(err?.response?.data?.detail ?? 'Erro ao atualizar status do pedido.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Botão de Voltar sutil */}
      <Link 
        to="/artisan/orders" 
        className="flex items-center gap-1 text-sm text-text/60 hover:text-primary mb-4 transition-colors w-fit"
      >
        <ArrowLeft size={16} /> Voltar para pedidos
      </Link>

      <div className="bg-card rounded-2xl p-6 flex flex-col gap-6 shadow-sm border border-primary/5">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Pedido #{order.order_id}</h2>
          <p className="text-xs text-text/50 mt-1">
            Criado em {new Date(order.created_at).toLocaleDateString('pt-BR')}{' '}
            às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Endereço de Entrega */}
        <div className="border-t border-primary/10 pt-4">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-primary mb-1">Endereço de Entrega</p>
              <p className="text-sm">
                <span className="font-medium text-text/70">Rua:</span> {order.shipping_address.street}, {order.shipping_address.number}
              </p>
              {order.shipping_address.complement && (
                <p className="text-sm">
                  <span className="font-medium text-text/70">Complemento:</span> {order.shipping_address.complement}
                </p>
              )}
              <p className="text-sm">
                <span className="font-medium text-text/70">Bairro:</span> {order.shipping_address.neighborhood}
              </p>
              <p className="text-sm">
                <span className="font-medium text-text/70">Cidade/Estado:</span> {order.shipping_address.city} - {order.shipping_address.state}
              </p>
              <p className="text-sm">
                <span className="font-medium text-text/70">CEP:</span> {order.shipping_address.zip_code}
              </p>
            </div>
          </div>
        </div>

        {/* Status e Gerenciamento */}
        <div className="border-t border-primary/10 pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-primary">Status Atual:</p>
            <OrderStatusBadge status={order.status} />
          </div>

          {canUpdateStatus ? (
            <div className="flex flex-col gap-3 bg-surface/30 p-4 rounded-xl border border-primary/5 mt-1">
              <p className="text-xs font-semibold text-text/70 uppercase tracking-wider">Alterar Status do Pedido</p>
              
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value as OrderStatus)
                    setFormError('')
                  }}
                  className="border border-primary/20 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none focus:border-primary flex-1 min-w-[200px]"
                >
                  <option value="">Selecione o próximo passo...</option>
                  {availableTransitions.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleUpdateStatus}
                  disabled={!selectedStatus || updating}
                  className="bg-success text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-success/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px] h-[38px]"
                >
                  {updating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Atualizar'
                  )}
                </button>
              </div>

              {/* Input Condicional do Código de Rastreio */}
              {requiresTrackingCode && (
                <div className="flex flex-col gap-1 bg-warning/5 border border-warning/20 rounded-lg p-3 mt-1 animate-fadeIn">
                  <label className="text-xs font-medium text-warning">
                    Código de Rastreio <span className="text-danger">*</span> — Obrigatório para despachar pacotes
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

              {formError && <p className="text-xs text-danger font-medium mt-1">{formError}</p>}
            </div>
          ) : (
            <p className="text-sm text-text/40 bg-surface/50 p-3 rounded-xl border border-primary/5 italic mt-1 text-center">
              Este pedido foi concluído, cancelado ou expirou. Não há mais transições de status disponíveis.
            </p>
          )}
        </div>

        {/* Itens do pedido */}
        <div className="border-t border-primary/10 pt-4">
          <p className="text-base font-bold text-primary mb-3">Itens do pedido</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="text-left text-xs text-text/50 border-b border-primary/10布">
                  <th className="pb-2 font-medium">Produto / Variante</th>
                  <th className="pb-2 font-medium text-center">Qtd</th>
                  <th className="pb-2 font-medium text-right">Preço Unitário</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.item_id} className="border-b border-primary/5 last:border-0 hover:bg-surface/20 transition-colors">
                    <td className="py-3 font-medium text-text">{item.product_variant_id}</td>
                    <td className="py-3 text-center text-text/80">{item.quantity}</td>
                    <td className="py-3 text-right text-text/80">R$ {item.unit_price.toFixed(2).replace('.', ',')}</td>
                    <td className="py-3 text-right text-primary font-semibold">
                      R$ {(item.unit_price * item.quantity).toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumo Financeiro */}
          <div className="flex flex-col items-end mt-4 pt-3 border-t border-primary/10 gap-1.5 text-sm">
            <p className="text-text/60">
              Produtos: <span className="font-medium text-text">R$ {order.price.toFixed(2).replace('.', ',')}</span>
            </p>
            <p className="text-text/60">
              Frete ({order.shipping_method}): <span className="font-medium text-text">R$ {order.shipping_cost.toFixed(2).replace('.', ',')}</span>
            </p>
            <p className="text-base font-bold mt-1 pt-1 border-t border-primary/5 text-text w-48 text-right">
              Total Geral: <span className="text-primary text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}