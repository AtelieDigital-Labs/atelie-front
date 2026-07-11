import { useState, useEffect } from 'react'
import { OrderStatusTabs, type OrderTabKey } from '../components/OrderStatusTabs'
import { OrderCard } from '../components/OrderCard'
import { Pagination } from '../../../../components/ui/Pagination'
import { ordersPageSchema, type OrderResponseType } from '../../../../schemas/order'

// MOCK 
const MOCK_ORDERS: OrderResponseType[] = [
  { order_id: 1, status: 'PENDING', checkout_group_id: '7guaigu5v2', created_at: new Date('2026-01-28T11:53:00') },
  { order_id: 2, status: 'PENDING', checkout_group_id: 'hajhszrjpw', created_at: new Date('2026-01-28T11:53:00') },
  { order_id: 3, status: 'DELIVERED', checkout_group_id: 'rpBazw0jok', created_at: new Date('2026-01-28T11:41:00') },
  { order_id: 4, status: 'PROCESSING', checkout_group_id: 'abc123xyz', created_at: new Date('2026-01-27T10:00:00') },
  { order_id: 5, status: 'CANCELLED', checkout_group_id: 'def456uvw', created_at: new Date('2026-01-26T09:00:00') },
]

const MOCK_PAGE_SIZE = 3

// simula GET /orders/?page=X&status=Y
async function mockFetchOrders(page: number, status: string | null) {
  const filtered = status ? MOCK_ORDERS.filter((o) => o.status === status) : MOCK_ORDERS
  const start = (page - 1) * MOCK_PAGE_SIZE
  const items = filtered.slice(start, start + MOCK_PAGE_SIZE)

  return {
    data: {
      items,
      total: filtered.length,
      page,
      size: MOCK_PAGE_SIZE,
      pages: Math.max(1, Math.ceil(filtered.length / MOCK_PAGE_SIZE)),
    },
  }
}

export function OrdersListPage() {
  const [activeTab, setActiveTab] = useState<OrderTabKey>('ALL')
  const [orders, setOrders] = useState<OrderResponseType[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      try {
        const status = activeTab === 'ALL' ? null : activeTab

        //trocar pela chamada real e remover mockFetchOrders:
        // const { data } = await api.get('/orders/', {
        //   params: { page: currentPage, ...(status ? { status } : {}) },
        // })
        const { data } = await mockFetchOrders(currentPage, status) // MOCK

        const parsed = ordersPageSchema.parse(data)
        setOrders(parsed.items)
        setTotalPages(parsed.pages)
        setTotalItems(parsed.total)
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [currentPage, activeTab])

  function handleTabChange(tab: OrderTabKey) {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-sm text-text/50">Carregando pedidos...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex flex-col gap-4 items-center">
      <div className="w-full max-w-3xl flex flex-col items-center gap-4">
        <OrderStatusTabs active={activeTab} onChange={handleTabChange} />
        
        <div className="w-full flex justify-end">
          <p className="text-md font-semibold text-text whitespace-nowrap">
            {totalItems} {totalItems === 1 ? 'Pedido' : 'Pedidos'}
          </p>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 text-center w-full max-w-3xl">
          <p className="text-sm text-text/50">Nenhum pedido encontrado nessa categoria.</p>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col gap-2 mb-8">
          {orders.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}