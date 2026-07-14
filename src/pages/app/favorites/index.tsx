import { useState } from 'react'
import { Heart } from 'lucide-react'
import { ProductCard } from '../../../components/ui/ProductCard'
import type { Product } from '../../../schemas/product'
import { useFavorites } from '../../../hooks/catalogs/useFavorites'
import { useProductsFavorites } from '../../../hooks/catalogs/useProducts'

// mock — simula GET /favorites/ + GET /products/{id} para cada favorito

export function Favorites() {
  const {data:favorites} = useFavorites()
  // console.log(favorites)
  const productIds = favorites?.map(favorite => favorite.product_id) ?? []
  console.log(productIds)
  const { data: products } = useProductsFavorites(productIds)
  console.log(products)

  // function handleRemove(productId: number) {
  //   // mock — quando integrar: DELETE /favorites/{product_id}
  //   setFavorites(prev => prev.filter(p => p.id !== productId))
  // }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 justify-between">
        <div className='flex items-center gap-2'> 
          <Heart size={22} className="text-primary" fill="currentColor" />
          <h2 className="text-2xl">Meus Favoritos</h2>
        </div>
        <span className="text-sm text-text/50">({favorites?.length} produtos)</span>
      </div>

      {favorites?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Heart size={48} className="text-primary/20" />
          <p className="text-lg font-semibold text-text">Nenhum favorito ainda</p>
          <p className="text-sm text-text/50">
            Explore os produtos e salve os que você mais gostou
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              // onRemoveFavorite={() => handleRemove(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}