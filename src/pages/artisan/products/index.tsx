import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'

import { Table } from '../../../components/ui/Table'
import { Pagination } from '../../../components/ui/Pagination'
import { Button } from '../../../components/ui/Button'
import { DashboardTabs } from '../components/DashboardTabs'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'
import { useGetMeStoreProducts } from '../../../hooks/catalogs/useStores'
import type { Product } from '../../../schemas/product'
import {useDeleteProduct} from '../../../hooks/catalogs/useProducts'


const ITEMS_PER_PAGE = 4

export function ArtisanProducts() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Estados para o modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  

  // Chamada da API usando React Query
  const { data: products = [], isPending, error } = useGetMeStoreProducts({
    enabled: true,
  })
  const deleteProduct = useDeleteProduct()

  // Regra do React: Retornos de renderização condicional devem vir APÓS todos os hooks declarados
  if (isPending) {
    return (
      <div className="flex h-48 items-center justify-center font-medium">
        Carregando produtos...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-48 items-center justify-center font-medium text-danger">
        Ocorreu um erro ao carregar os produtos.
      </div>
    )
  }

  // Cálculos de Paginação
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const paginatedProducts = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  )

  // Handlers do Modal
  function handleOpenDeleteModal(product: Product) {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }


  function handleConfirmDelete() {
    if (!productToDelete) return
    setDeleteError(null)

    deleteProduct.mutate(productToDelete.id, {
      onSuccess: () => handleCloseDeleteModal(),
      onError: (error: any) => {
        setDeleteError(
          error?.response?.data?.detail ?? 'Erro ao excluir produto.'
        )
      },
    })
  }

  // Configuração das Colunas da Tabela (Tipagem unificada em 'Product')
  const COLUMNS = [
    {
      key: 'name',
      label: 'Nome do Produto',
      render: (row: Product) => {
        const firstImage = row.variations?.[0]?.images?.[0]?.url
        return (
          <div className="flex items-center gap-3">
            <div className="bg-surface h-10 w-10 shrink-0 overflow-hidden rounded-xl">
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={row.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-primary/10 h-full w-full" />
              )}
            </div>
            <span className="font-medium">{row.name}</span>
          </div>
        )
      },
    },
    {
      key: 'price',
      label: 'Preço',
      render: (row: Product) => {
        const price = row.variations?.[0]?.price ?? 0
        return (
          <span className="text-primary font-semibold">
            {price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        )
      },
    },
    {
      key: 'stock',
      label: 'Estoque',
      render: (row: Product) => {
        const stock = row.variations?.[0]?.stock ?? 0
        return (
          <span className={stock === 0 ? 'text-text/40' : 'text-text'}>
            {stock === 0 ? 'Esgotado' : `${stock} unid.`}
          </span>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Product) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.is_active
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger'
          }`}
        >
          {row.is_active ? 'ATIVO' : 'INATIVO'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row: Product) => (
        <div className="flex items-center gap-3">
          <Link to={`/artisan/products/edit/${row.id}`}>
            <button
              aria-label="Editar"
              className="text-warning hover:text-warning/70 cursor-pointer transition-colors"
            >
              <Pencil size={16} />
            </button>
          </Link>

          <button
            aria-label="Excluir"
            className="text-danger hover:text-danger-dark cursor-pointer transition-colors"
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
        data={paginatedProducts}
        emptyMessage="Nenhum produto cadastrado"
      />

      <div className="flex items-center justify-end">
        {/* Mantém a paginação e o botão alinhados nas extremidades */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        <Button
          className='flex items-center justify-end!'
          size="md"
          variant="success"
          onClick={() => navigate('/artisan/products/new')}
        >
          Adicionar Produto
        </Button>
      </div>

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
        isConfirming={deleteProduct.isPending}
        errorMessage={deleteError}
      />
    </div>
  )
}