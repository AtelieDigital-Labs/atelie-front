import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../../../components/ui/ProductCard'
import type { Product } from "../../../dtos/product"

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laço Infantil Clássico Princesa em Cetim',
    description: 'Laço artesanal feito à mão em cetim premium.',
    store_id: 1, is_active: true,
    shopName: 'Ateliê Bia', rating: 5, reviewCount: 312,
    monthlySales: 'Mais de 200 vendas no mês passado',
    discount: 20, deliveryDate: 'qui., 12 de jun.', freeShipping: true,
    variations: [{
      id: 1, price: 30.00, sku: 'LAC-001', stock: 15,
      color: 'Rosa', size: 'U', weight: 0.1, length: 10, width: 8, height: 2,
      images: [{ id: 1, url: 'https://placehold.co/400x400?text=Laco', is_primary: true }],
    }],
  },
  {
    id: 2,
    name: 'Prato De Sobremesa em Cerâmica Artesanal',
    description: 'Peça única torneada e esmaltada à mão.',
    store_id: 2, is_active: true,
    shopName: 'Cerâmica Sálvia', rating: 4, reviewCount: 187,
    monthlySales: 'Mais de 100 vendas no mês passado',
    discount: 20, deliveryDate: 'qui., 12 de jun.', freeShipping: true,
    variations: [{
      id: 2, price: 48.64, sku: 'PRA-001', stock: 8,
      color: null, size: null, weight: 0.4, length: 20, width: 20, height: 3,
      images: [{ id: 2, url: 'https://placehold.co/400x400?text=Prato', is_primary: true }],
    }],
  },
]

export function SearchPage(){
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''

  // mock de filtro — quando vier a API, substitui por fetch
  const filtered = MOCK_PRODUCTS.filter(p => {
    if (query) {
      return (
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    }
    return true
  })

  const title = query
    ? `Resultados para "${query}"`
    : category
      ? `Categoria: ${category}`
      : 'Todos os produtos'


  return(
      <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{title}</h2>
        <span className="text-sm text-text/50">{filtered.length} produtos encontrados</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <p className="text-xl font-semibold text-primary">Nenhum produto encontrado</p>
          <p className="text-sm text-text/50">
            Tente buscar por outro termo ou explore as categorias
          </p>
        </div>
      )}

    </div>
  )
  
}