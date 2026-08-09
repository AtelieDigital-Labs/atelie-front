import { ProductCard } from '../../../../components/ui/ProductCard'
import type { Product } from '../../../../dtos/product'

const MOCK_RELATED: Product[] = [
  {
    id: 2,
    name: 'Prato De Sobremesa em Cerâmica Artesanal',
    description: 'Peça única torneada e esmaltada à mão.',
    store_id: 2,
    is_active: true,
    shopName: 'Cerâmica Sálvia',
    rating: 4,
    reviewCount: 187,
    monthlySales: 'Mais de 100 vendas no mês passado',
    discount: 20,
    deliveryDate: 'qui., 12 de jun.',
    freeShipping: true,
    variations: [
      {
        id: 2, price: 48.64, sku: 'PRA-001', stock: 8,
        color: null, size: null, weight: 0.4, length: 20, width: 20, height: 3,
        images: [{ id: 2, url: 'https://placehold.co/400x400?text=Prato', is_primary: true }],
      },
    ],
  },
  {
    id: 3,
    name: 'Tiara de Pompom com Pérolas Aplicadas',
    description: 'Tiara delicada com pompons artesanais e pérolas.',
    store_id: 3,
    is_active: true,
    shopName: 'Tiara Boutique',
    rating: 3.5,
    reviewCount: 98,
    monthlySales: 'Mais de 80 vendas no mês passado',
    deliveryDate: 'ter., 17 de jun.',
    fastDelivery: true,
    variations: [
      {
        id: 3, price: 30.00, sku: 'TIA-001', stock: 20,
        color: 'Dourado', size: 'U', weight: 0.05, length: 15, width: 5, height: 3,
        images: [{ id: 3, url: 'https://placehold.co/400x400?text=Tiara', is_primary: true }],
      },
    ],
  },
]

export function RelatedProducts() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl mb-6">Você também pode gostar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_RELATED.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}