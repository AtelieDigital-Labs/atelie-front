import { Stars } from './Stars'
import { FavoriteButton } from './FavoriteButton'
import { type Product, type ProductVariation } from '../../schemas/product'
import {Button} from './Button'
import { Link } from 'react-router-dom'

function getPrimaryImage(variations: ProductVariation[]): string | null {
  for (const variation of variations) {
    const primary = variation.images.find(img => img.is_primary)
    if (primary) return primary.url
  }
  return null
}

function getLowestPrice(variations: ProductVariation[]): number {
  return Math.min(...variations.map(v => v.price))
}

function getOriginalPrice(price: number, discount: number): string {
  return (price / (1 - discount / 100)).toFixed(2).replace('.', ',')
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',')
}

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getPrimaryImage(product.variations)
  const price = getLowestPrice(product.variations)
  const badge = product.freeShipping
    ? 'Frete grátis'
    : product.fastDelivery
      ? 'Envio rápido'
      : null

  return (
    <div className="bg-card rounded-2xl overflow-hidden flex flex-col">
    <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
  
      {/* Imagem */}
      <div className="relative bg-surface aspect-square flex items-center justify-center">
        {badge && (
          <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-medium px-3 py-1 rounded-full">
            {badge}
          </span>
        )}

        <div className="absolute top-3 right-3">
          <FavoriteButton />
        </div>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-primary/10 rounded-full" />
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-2 p-4 flex-1">

        {/* Nome */}
        <div>
          <p className="text-sm text-text/80">
            {product.shopName && (
              <span className="font-semibold text-text">{product.shopName} </span>
            )}
            {product.name}
          </p>
          <p className="text-xs text-text/50 mt-0.5 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Avaliação */}
        {product.rating !== undefined && (
          <Stars rating={product.rating} reviewCount={product.reviewCount} />
        )}

        {/* Vendas no mês */}
        {product.monthlySales && (
          <p className="text-xs text-text/50">{product.monthlySales}</p>
        )}

        {/* Preço */}
        <div className="flex items-baseline gap-2 mt-auto">
          {product.discount && (
            <span className="text-xs font-semibold text-success">
              -{product.discount}%
            </span>
          )}
          <span className="text-base font-bold text-text">
            R$ {formatPrice(price)}
          </span>
          {product.discount && (
            <span className="text-xs text-text/40 line-through">
              R$ {getOriginalPrice(price, product.discount)}
            </span>
          )}
        </div>

        {/* Entrega */}
        {product.deliveryDate && (
          <p className="text-xs text-text/60">
            <span className="font-semibold">Entrega GRÁTIS:</span>{' '}
            {product.deliveryDate}
          </p>
        )}

      </div>
    </Link>
          <Button variant='secondary' className='Adicionar'>Adicionar</Button>
    </div>
  )
}