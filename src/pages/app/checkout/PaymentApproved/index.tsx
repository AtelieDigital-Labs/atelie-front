import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Check, Store } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { orderReadSchema, type OrderGroup } from '../../../../schemas/order'



const MOCK_ORDERS: OrderGroup = [
  {
    order_id: 1,
    status: 'PAID',
    price: 48.64,
    shipping_cost: 0,
    shipping_method: 'Econômico',
    tracking_code: null,
    payment_method: 'pix',
    store_id: 'store-1',
    created_at: new Date(),
    shipping_address: {
      street: 'Rua Exemplo',
      number: 123,
      complement: null,
      neighborhood: 'Centro',
      city: 'Pau dos Ferros',
      state: 'RN',
      zip_code: '59900-000',
    },
    items: [
      { item_id: 1, product_variant_id: 'var-1', quantity: 1, unit_price: 48.64 },
    ],
  },
  {
    order_id: 2,
    status: 'PAID',
    price: 38.0,
    shipping_cost: 0,
    shipping_method: 'Econômico',
    tracking_code: null,
    payment_method: 'pix',
    store_id: 'store-2',
    created_at: new Date(),
    shipping_address: {
      street: 'Rua Exemplo',
      number: 123,
      complement: null,
      neighborhood: 'Centro',
      city: 'Pau dos Ferros',
      state: 'RN',
      zip_code: '59900-000',
    },
    items: [
      { item_id: 2, product_variant_id: 'var-2', quantity: 1, unit_price: 38.0 },
    ],
  },
]

async function mockFetchOrder(orderId: number) {
  const found = MOCK_ORDERS.find((o) => o.order_id === orderId)
  return { data: found }
}

export function PaymentApprovedPage() {
  const { checkoutGroupId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const orderIds: number[] = state?.order_ids ?? [1, 2] // mock fixo enquanto não integra

  const [orders, setOrders] = useState<OrderGroup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (!orderIds || orderIds.length === 0) {
        setLoading(false)
        return
      }

      try {
        const results = await Promise.all(
          orderIds.map(async (id) => {
            // trocar pela chamada real e remover mockFetchOrder:
            // const { data } = await api.get(`/orders/${id}`)
            const { data } = await mockFetchOrder(id) // MOCK
            return orderReadSchema.parse(data)
          })
        )
        setOrders(results)
      } catch (error) {
        console.error('Erro ao buscar pedidos do grupo:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [orderIds])

  if (loading || !orders) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-sm text-text/50">Carregando pedido...</p>
      </div>
    )
  }

  const total = orders.reduce((acc, order) => acc + order.price + order.shipping_cost, 0)

  return (
    <div className="max-w-md mx-auto bg-card rounded-2xl p-6 flex flex-col gap-6">

      
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-28 h-28 rounded-full bg-success flex items-center justify-center">
          <Check className="text-white" size={56} />
        </div>
        <h2 className="text-lg font-bold text-text">Pagamento Aprovado!</h2>
        <p className="text-xs text-text/50">
          Seu pedido foi confirmado e já está sendo processado
        </p>

        <div className="w-full bg-surface rounded-xl px-4 py-2.5 flex justify-between items-center text-xs mt-2">
          <span className="text-text/50">Número da Transação:</span>
          <span className="font-mono text-primary font-semibold">{checkoutGroupId}</span>
        </div>
      </div>

     
      {orders.map((order) => (
        <div key={order.order_id} className="flex flex-col gap-3 border-t border-primary/10 pt-6">

          <div className="bg-surface rounded-full px-3 py-1.5 text-center text-xs text-text/60 font-mono w-fit mx-auto">
            Número do Pedido: {order.order_id}
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Store size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-text/40 uppercase">Loja</p>
              <p className="text-sm font-semibold text-text">Loja {order.store_id}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-text/40 uppercase">Produtos</p>
            {order.items.map((item) => (
              <div key={item.item_id} className="flex justify-between text-xs gap-3">
                <span className="text-text/70">
                  {item.quantity}x Produto {item.product_variant_id}
                </span>
                <span className="text-text/70 shrink-0">
                  R$ {item.unit_price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-text/70">Subtotal</span>
            <span className="text-sm font-bold text-primary">
              R$ {(order.price + order.shipping_cost).toFixed(2)}
            </span>
          </div>
        </div>
      ))}

     
      <div className="flex flex-col gap-3 border-t border-primary/10 pt-6">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-text">Total</span>
          <span className="text-lg font-bold text-primary">R$ {total.toFixed(2)}</span>
        </div>

        <Button fullWidth onClick={() => navigate('/client/orders')} className="cursor-pointer">
          Ver Detalhes do Pedido
        </Button>
      </div>

    </div>
  )
}