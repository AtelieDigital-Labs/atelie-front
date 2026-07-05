import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Table } from '../../../components/ui/Table'
import { Pagination } from '../../../components/ui/Pagination'
import { Button } from '../../../components/ui/Button'
import { DashboardTabs } from '../components/DashboardTabs'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'


type ArtisanProduct = {
  id: number
  name: string
  price: number
  stock: number
  is_active: boolean
  image?: string
}

const MOCK_PRODUCTS: ArtisanProduct[] = [
  { id: 1, name: 'Laço Borboleta', price: 28.00, stock: 0, is_active: true },
  { id: 2, name: 'Laço Infantil Clássico Princesa', price: 30.00, stock: 0, is_active: true },
  { id: 3, name: 'Laço Crinol', price: 30.00, stock: 0, is_active: true },
  { id: 4, name: 'Laço parzinho cinderela', price: 38.00, stock: 0, is_active: true },
  { id: 5, name: 'Laço Infantil Brilho Suave Encantado', price: 30.00, stock: 10, is_active: true },
]



const ITEMS_PER_PAGE = 4

export function ArtisanProducts() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  // Estados para o modal 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ArtisanProduct | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const totalPages = Math.ceil(MOCK_PRODUCTS.length / ITEMS_PER_PAGE)
  const paginated = MOCK_PRODUCTS.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)


   // Abre o modal com o produto selecionado
  function handleOpenDeleteModal(product: ArtisanProduct) {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  // Fecha o modal
  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }

  // Confirma a exclusão
  async function handleConfirmDelete() {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      // TODO: Quando integrar com API
      // await api.delete(`/products/${productToDelete.id}`)

      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 800))

      console.log('Produto excluído:', productToDelete.id)

      // Fecha o modal
      handleCloseDeleteModal()

      // TODO: toast.success('Produto excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      // TODO: toast.error('Erro ao excluir produto. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const COLUMNS = [
  {
    key: 'name',
    label: 'Nome do Produto',
    render: (row: ArtisanProduct) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface shrink-0 overflow-hidden">
          {row.image
            ? <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-primary/10" />
          }
        </div>
        <span className="font-medium">{row.name}</span>
      </div>
    ),
  },
  {
    key: 'price',
    label: 'Preço',
    render: (row: ArtisanProduct) => (
      <span className="text-primary font-semibold">
        R$ {row.price.toFixed(2).replace('.', ',')}
      </span>
    ),
  },
  {
    key: 'stock',
    label: 'Estoque',
    render: (row: ArtisanProduct) => (
      <span className={row.stock === 0 ? 'text-text/40' : 'text-text'}>
        {row.stock === 0 ? 'None unid.' : `${row.stock} unid.`}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: ArtisanProduct) => (
      <span className={`
        text-xs font-semibold px-3 py-1 rounded-full
        ${row.is_active
          ? 'bg-success/10 text-success'
          : 'bg-danger/10 text-danger'
        }
      `}>
        {row.is_active ? 'ATIVO' : 'INATIVO'}
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Ações',
    render: (row: ArtisanProduct) => (
      <div className="flex items-center gap-3">
        <Link to={`/artisan/products/edit/${row.id}`}>
          <button aria-label="Editar" className="text-warning hover:text-warning/70 transition-colors cursor-pointer">
            <Pencil size={16} />
          </button>
        </Link>

        
        
        <button 
          aria-label="Excluir" 
          className="text-danger hover:text-danger-dark transition-colors justify-end cursor-pointer"
          onClick={() => handleOpenDeleteModal(row)}
        >
          <Trash2 size={16} />
        </button>
      
      </div>
    ),
  },
  ]

  return (
    <div className="flex flex-col gap-6">
      <DashboardTabs />

      <Table
        columns={COLUMNS}
        data={paginated}
        emptyMessage="Nenhum produto cadastrado"
      />

      <div className="flex items-center justify-end">
        <Button size="md" variant="success" onClick={()=> navigate('/artisan/products/new')}>
          Adicionar Produto
        </Button>
      </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}  />

      {/* Modal de confirmação de exclusão */}
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Excluir produto"
          message={
            productToDelete
              ? `Tem certeza que deseja excluir "${productToDelete.name}"? Esta ação não pode ser desfeita.`
              : 'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.'
          }
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="danger"
          isConfirming={isDeleting}
        />
    </div>
  )
}