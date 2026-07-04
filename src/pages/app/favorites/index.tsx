import { useState } from 'react'
import { Heart } from 'lucide-react'
import { ProductCard } from '../../../components/ui/ProductCard'
import type { Product } from '../../../schemas/product'

// mock — simula GET /favorites/ + GET /products/{id} para cada favorito
const MOCK_FAVORITES: Product[] = [
  {
    id: 1,
    name: 'Laço Infantil Clássico Princesa em Cetim',
    description: 'Laço artesanal feito à mão em cetim premium.',
    store_id: 1,
    is_active: true,
    shopName: 'Ateliê Bia',
    rating: 5,
    reviewCount: 312,
    monthlySales: 'Mais de 200 vendas no mês passado',
    discount: 20,
    deliveryDate: 'qui., 12 de jun.',
    freeShipping: true,
    variations: [{
      id: 1, price: 30.00, sku: 'LAC-001', stock: 15,
      color: 'Rosa', size: 'U', weight: 0.1, length: 10, width: 8, height: 2,
      images: [{ id: 1, url: 'https://placehold.co/400x400?text=Laco', is_primary: true }],
    }],
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
    deliveryDate: 'ter., 17 de jun.',
    fastDelivery: true,
    variations: [{
      id: 3, price: 30.00, sku: 'TIA-001', stock: 20,
      color: 'Dourado', size: 'U', weight: 0.05, length: 15, width: 5, height: 3,
      images: [{ id: 3, url: 'https://placehold.co/400x400?text=Tiara', is_primary: true }],
    }],
  },
]

export function Favorites() {
  const [favorites, setFavorites] = useState<Product[]>(MOCK_FAVORITES)

  function handleRemove(productId: number) {
    // mock — quando integrar: DELETE /favorites/{product_id}
    setFavorites(prev => prev.filter(p => p.id !== productId))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 justify-between">
        <div className='flex items-center gap-2'> 
          <Heart size={22} className="text-primary" fill="currentColor" />
          <h2 className="text-2xl">Meus Favoritos</h2>
        </div>
        <span className="text-sm text-text/50">({favorites.length} produtos)</span>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Heart size={48} className="text-primary/20" />
          <p className="text-lg font-semibold text-text">Nenhum favorito ainda</p>
          <p className="text-sm text-text/50">
            Explore os produtos e salve os que você mais gostou
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onRemoveFavorite={() => handleRemove(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}