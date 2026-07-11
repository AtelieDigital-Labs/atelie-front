import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Table } from '../../../components/ui/Table'
import { Pagination } from '../../../components/ui/Pagination'
import { DashboardTabs } from '../components/DashboardTabs'

type Order = {
  id: string
  date: string
  customer: string
  email: string
  status: 'PENDENTE' | 'APROVADO' | 'CANCELADO'
  shipping: 'AGUARDANDO' | 'ENVIADO' | 'ENTREGUE'
  total: number
}

const MOCK_ORDERS: Order[] = [
  {
    id: '#rp8szw0jok',
    date: '28 Jan, 2026',
    customer: 'alessandra',
    email: 'alessandra@gmail.com',
    status: 'PENDENTE',
    shipping: 'AGUARDANDO',
    total: 112.00,
  },
]

const STATUS_STYLES = {
  PENDENTE:  'bg-warning/10 text-warning',
  APROVADO:  'bg-success/10 text-success',
  CANCELADO: 'bg-danger/10 text-danger',
}

const SHIPPING_STYLES = {
  AGUARDANDO: 'bg-warning/10 text-warning',
  ENVIADO:    'bg-secondary/10 text-secondary',
  ENTREGUE:   'bg-success/10 text-success',
}

const COLUMNS = (navigate: ReturnType<typeof useNavigate>) => [
  {
    key: 'order',
    label: 'Pedido',
    render: (row: Order) => (
      <div>
        <p className="font-semibold text-primary">{row.id}</p>
        <p className="text-xs text-text/50">{row.date}</p>
      </div>
    ),
  },
  {
    key: 'customer',
    label: 'Cliente',
    render: (row: Order) => (
      <div>
        <p className="font-medium">{row.customer}</p>
        <p className="text-xs text-text/50">{row.email}</p>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: Order) => (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[row.status]}`}>
        {row.status}
      </span>
    ),
  },
  {
    key: 'shipping',
    label: 'Envio',
    render: (row: Order) => (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${SHIPPING_STYLES[row.shipping]}`}>
        {row.shipping}
      </span>
    ),
  },
  {
    key: 'total',
    label: 'Total',
    render: (row: Order) => (
      <span className="font-semibold">
        R$ {row.total.toFixed(2).replace('.', ',')}
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Ações',
    render: (row: Order) => (
      <button
        onClick={() => navigate(`/artisan/orders/${row.id.replace('#', '')}`)}
        aria-label="Ver detalhes"
        className="text-text/40 hover:text-primary transition-colors cursor-pointer"
      >
        <Search size={16} />
      </button>
    ),
  },
]

const ITEMS_PER_PAGE = 10

export function ArtisanOrders() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(MOCK_ORDERS.length / ITEMS_PER_PAGE)
  const paginated = MOCK_ORDERS.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col gap-6">
      <DashboardTabs />

      <Table
        columns={COLUMNS(navigate)}
        data={paginated}
        emptyMessage="Nenhum pedido encontrado"
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}