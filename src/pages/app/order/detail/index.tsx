import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Check, Store, RefreshCw, Clock, X, Package } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { orderReadSchema, orderCreatedSchema, type OrderRead } from '../../../../schemas/order'
import {OrderStatusBadge} from '../../../../components/ui/OrderStatusBadge'
import {type OrderStatus} from  '../../../../schemas/order'



const MOCK_ORDER: OrderRead = {
  order_id: 2,
  status: 'PENDING', //  muda o header de acordo com esse status
  price: 38.0,
  shipping_cost: 0,
  shipping_method: 'Econômico',
  tracking_code: null,
  payment_method: 'pix',
  store_id: 'VL Princesa Estilosa',
  checkout_group_id: 'mock-group-id',
  created_at: new Date('2026-01-28'),
  shipping_address: {
    street: 'Rua das Araucarias',
    number: 355,
    complement: null,
    neighborhood: 'Centro',
    city: 'Pau dos Ferros',
    state: 'RN',
    zip_code: '59900000',
  },
  items: [
    { item_id: 1, product_variant_id: 'Laço parzinho cinderela', quantity: 1, unit_price: 38.0 },
  ],
}

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

async function mockFetchOrder(orderId: number) {
  return { data: MOCK_ORDER }
}

async function mockRetryPayment(checkoutGroupId: string) {
  return {
    data: {
      message: 'Pagamento gerado',
      checkout_group_id: checkoutGroupId,
      order_ids: [2],
      payment_info: {
        id: 'mp-payment-456',
        qr_code_base64: '',
        qr_code: '00020126580014br.gov.bcb.pix0136a1b2c3-teste-fake6304ABCD',
      },
    },
  }
}


export function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderRead | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingPix, setGeneratingPix] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return
      try {
        // trocar pela chamada real e remover mockFetchOrder:
        // const { data } = await api.get(`/orders/${orderId}`)
        const { data } = await mockFetchOrder(Number(orderId)) // MOCK
        setOrder(orderReadSchema.parse(data))
      } catch (error) {
        console.error('Erro ao buscar pedido:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  async function handleGerarPix() {
    if (!order) return
    setGeneratingPix(true)

    try {
      // trocar pela chamada real e remover mockRetryPayment:
      // const response = await api.post('/orders/payments/retry', {
      //   checkout_group_id: order.checkout_group_id,
      // })
      const response = await mockRetryPayment(order.checkout_group_id) // MOCK

      const data = orderCreatedSchema.parse(response.data)

      navigate('/checkout/payment', {
        state: {
          payment_info: data.payment_info,
          order_ids: data.order_ids,
          checkout_group_id: data.checkout_group_id,
        },
      })
    } catch (error: any) {
      // se o retry falhar (mesmo erro 502 do MP), volta pra tela de erro genérica
      navigate('/checkout/payment-error', {
        state: {
          message: error?.response?.data?.detail ?? 'Erro ao gerar o pagamento.',
        },
      })
    } finally {
      setGeneratingPix(false)
    }
  }

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-sm text-text/50">Carregando pedido...</p>
      </div>
    )
  }

 
  const total = order.price + order.shipping_cost

  return (
    <div className="max-w-xl mx-auto bg-card rounded-2xl p-6 flex flex-col gap-6">

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
              {order.created_at.toLocaleDateString('pt-BR', {
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
            <span className="text-text/70 shrink-0">R$ {item.unit_price.toFixed(2)}</span>
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
          <p className="text-text/70">Total: R$ {total.toFixed(2)}</p>
        </div>
      </div>

    
      <div className="border-t border-primary/10 pt-6 flex flex-col gap-1">
        <div className="flex justify-between text-sm text-text/60">
          <span>Subtotal</span>
          <span>R$ {order.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-text">
          <span>Total</span>
          <span className="text-primary">R$ {total.toFixed(2)}</span>
        </div>
      </div>

     
      {/*  botão condicional - aparece se PENDING ou EXPIRED */}
      {(order.status === 'PENDING' || order.status === 'EXPIRED') && (
        <div className="flex flex-col gap-3">
          <div className="bg-warning/10 rounded-xl p-3 flex items-start gap-2 text-left">
            <RefreshCw size={16} className="text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-warning font-medium">
              {order.status === 'EXPIRED'
                ? 'O código PIX anterior expirou. Clique em "Gerar PIX" abaixo para criar um novo pagamento.'
                : 'Este pedido ainda não foi pago. Clique em "Gerar PIX" abaixo para exibir o código de pagamento.'
              }
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
        onClick={() => navigate('/client/orders')}
        className="cursor-pointer"
      >
        Acompanhar Meus Pedidos
      </Button>
      </div>
      

    </div>
  )
}