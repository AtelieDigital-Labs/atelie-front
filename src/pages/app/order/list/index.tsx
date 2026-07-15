import { useState } from 'react'
import { OrderStatusTabs, type OrderTabKey } from '../components/OrderStatusTabs'
import { OrderCard } from '../components/OrderCard'
import { Pagination } from '../../../../components/ui/Pagination'
import { useGetMeOrders } from '../../../../hooks/orders/useOrders'

const PAGE_SIZE = 10

export function OrdersListPage() {
  const [activeTab, setActiveTab] = useState<OrderTabKey>('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  const status = activeTab === 'ALL' ? undefined : activeTab

  const { data: ordersPage, isPending: loading } = useGetMeOrders(currentPage, PAGE_SIZE, status)

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

  const orders = ordersPage?.items ?? []
  const totalItems = ordersPage?.total ?? 0
  const totalPages = ordersPage?.pages ?? 1

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

      {orders.length === 0 ? (
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
