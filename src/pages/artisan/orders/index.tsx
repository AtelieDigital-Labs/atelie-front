import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2 } from 'lucide-react'
import { Table } from '../../../components/ui/Table'
import { Pagination } from '../../../components/ui/Pagination'
import { DashboardTabs } from '../components/DashboardTabs'
import { useGetStoreOrders } from '../../../hooks/orders/useOrders'
import { type OrderArtisanSummary, type OrderStatus } from '../../../schemas/order'

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  PROCESSING: 'Processando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  EXPIRED: 'Expirado',
  REFUSED: 'Recusado',
  CANCELLED: 'Cancelado',
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:    'bg-warning/10 text-warning',
  PAID:       'bg-success/10 text-success',
  PROCESSING: 'bg-info/10 text-info',
  SHIPPED:    'bg-secondary/10 text-secondary',
  DELIVERED:  'bg-success/10 text-success',
  EXPIRED:    'bg-danger/10 text-danger',
  REFUSED:    'bg-danger/10 text-danger',
  CANCELLED:  'bg-danger/10 text-danger',
}

const COLUMNS = (navigate: ReturnType<typeof useNavigate>) => [
  {
    key: 'order',
    label: 'Pedido',
    render: (row: OrderArtisanSummary) => (
      <div>
        <p className="font-semibold text-primary">#{row.order_id}</p>
        <p className="text-xs text-text/50">
          {new Date(row.created_at).toLocaleDateString('pt-BR')}{' '}
          {new Date(row.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: OrderArtisanSummary) => (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[row.status]}`}>
        {STATUS_LABELS[row.status]}
      </span>
    ),
  },
  {
    key: 'total',
    label: 'Valor do Pedido',
    render: (row: OrderArtisanSummary) => (
      <span className="font-semibold text-text">
        R$ {row.price.toFixed(2).replace('.', ',')}
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Ações',
    render: (row: OrderArtisanSummary) => (
      <button
        onClick={() => navigate(`/artisan/orders/${row.order_id}`)}
        aria-label="Ver detalhes"
        className="text-text/40 hover:text-primary transition-colors cursor-pointer"
      >
        <Search size={16} />
      </button>
    ),
  },
]

export function ArtisanOrders() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  
  // Passamos o estado da página atual diretamente para o nosso hook reativo
  const { data, isPending, error } = useGetStoreOrders(page)
  
  if (isPending) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 text-danger font-medium">
        Não foi possível carregar os pedidos da loja.
      </div>
    )
  }

  // Extração segura baseada na resposta envelopada do seu backend
  const orders = data?.items ?? []
  const totalPages = data?.pages ?? 1

  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardTabs />

      <Table
        columns={COLUMNS(navigate)}
        data={orders} // Passando a lista direta vinda do servidor
        emptyMessage="Nenhum pedido encontrado para a sua loja."
      />

      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
      )}
    </div>
  )
}