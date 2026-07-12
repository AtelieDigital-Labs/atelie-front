import { Minus, Plus, Share2, Heart, Store } from 'lucide-react'
import { useState } from 'react'
import { Stars } from '../../../components/ui/Stars'
import { ProductGallery } from './components/ProductGallery'
import { ReviewList } from './components/ReviewList'
import { RelatedProducts } from './components/RelatedProducts'
import type { Product } from '../../../schemas/product'
import {Button} from '../../../components/ui/Button'

const MOCK_PRODUCT: Product = {
  id: 1,
  name: 'Laço Infantil Clássico Princesa em Cetim',
  description: 'Cada laço é montado à mão com cetim importado, fita francesa e acabamento em pérolas naturais. Peça atemporal que combina com vestidos de festa, batizados e ensaios fotográficos.',
  store_id: 1,
  is_active: true,
  shopName: 'Ateliê Bia',
  rating: 5,
  reviewCount: 312,
  monthlySales: 'Mais de 200 vendas no mês passado',
  discount: 20,
  freeShipping: true,
  deliveryDate: 'qui., 12 de jun.',
  highlights: [
    'Cetim premium importado',
    'Bico de pato antialérgico',
    'Acabamento em pérolas naturais',
    'Embalagem para presente inclusa',
  ],
  about: 'Cada laço é montado à mão com cetim importado, fita francesa e acabamento em pérolas naturais. Peça atemporal que combina com vestidos de festa, batizados e ensaios fotográficos.',
  variations: [
    {
      id: 1, price: 30.00, sku: 'LAC-001-ROSA', stock: 18,
      color: 'Rosa Bebê', size: 'U', weight: 0.1, length: 10, width: 8, height: 2,
      images: [
        { id: 1, url: 'https://placehold.co/600x600?text=Rosa', is_primary: true },
        { id: 2, url: 'https://placehold.co/600x600?text=Detalhe', is_primary: false },
        { id: 3, url: 'https://placehold.co/600x600?text=Embalagem', is_primary: false },
      ],
    },
    {
      id: 2, price: 30.00, sku: 'LAC-001-MARFIM', stock: 12,
      color: 'Marfim', size: 'U', weight: 0.1, length: 10, width: 8, height: 2,
      images: [{ id: 4, url: 'https://placehold.co/600x600?text=Marfim', is_primary: true }],
    },
    {
      id: 3, price: 30.00, sku: 'LAC-001-TERRA', stock: 6,
      color: 'Terracota', size: 'U', weight: 0.1, length: 10, width: 8, height: 2,
      images: [{ id: 5, url: 'https://placehold.co/600x600?text=Terracota', is_primary: true }],
    },
    {
      id: 4, price: 30.00, sku: 'LAC-001-VINHO', stock: 9,
      color: 'Vinho', size: 'U', weight: 0.1, length: 10, width: 8, height: 2,
      images: [{ id: 6, url: 'https://placehold.co/600x600?text=Vinho', is_primary: true }],
    },
  ],
}

export function ProductDetail() {
  const product = MOCK_PRODUCT
  const [selectedVariation, setSelectedVariation] = useState(product.variations[0])
  const [selectedImage, setSelectedImage] = useState(
  selectedVariation.images.find(img => img.is_primary) ?? selectedVariation.images[0] ?? null
  )
  const [quantity, setQuantity] = useState(1)

  const price = selectedVariation.price
  const originalPrice = product.discount
    ? price / (1 - product.discount / 100)
    : null  

  function handleVariationChange(variation: typeof selectedVariation) {
    setSelectedVariation(variation)
    setSelectedImage(
      variation.images.find(img => img.is_primary) ?? variation.images[0]
    )
    setQuantity(1)
  }

  return (
    <div className="flex flex-col gap-12">

      {/* Topo — galeria + info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Galeria */}
        <ProductGallery
          images={selectedVariation.images}
          selected={selectedImage}
          onSelect={setSelectedImage}
        />

        {/* Info */}
        <div className="flex flex-col gap-5">

          {/* Loja */}
          <div className="flex items-center gap-1.5 text-primary text-sm">
            <Store size={14} />
            <span className="font-semibold uppercase tracking-wide">
              {product.shopName}
            </span>
          </div>

          {/* Nome + variação */}
          <h1 className="font-title text-3xl text-text leading-snug">
            {product.name}{' '}
            {selectedVariation.color && (
              <span className="text-primary">— {selectedVariation.color}</span>
            )}
          </h1>

          {/* Avaliação */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-3 flex-wrap">
              <Stars rating={product.rating} />
              <span className="text-sm text-text/60">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-text/60">· {product.reviewCount} avaliações</span>
              <span className="text-sm text-text/60">· {product.monthlySales}</span>
            </div>
          )}
          {/* Seletor de cor */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-text/70">
              Cor: <span className="font-semibold text-text">{selectedVariation.color}</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.variations.map(variation => (
                <button
                  key={variation.id}
                  onClick={() => handleVariationChange(variation)}
                  className={`
                    flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-colors min-w-20
                    ${selectedVariation.id === variation.id
                      ? 'border-primary'
                      : 'border-surface hover:border-primary/40'
                    }
                  `}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface">
                    {variation.images[0] && (
                      <img
                        src={variation.images[0].url}
                        alt={variation.color ?? ''}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-xs text-text/70">{variation.color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preço + pagamento */}
          <div className="bg-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-baseline gap-3">
              {product.discount && (
                <span className="bg-success text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  -{product.discount}%
                </span>
              )}
              <span className="text-3xl font-bold text-text">
                R$ {price.toFixed(2).replace('.', ',')}
              </span>
              {originalPrice && (
                <span className="text-sm text-text/40 line-through">
                  R$ {originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
            <p className="text-xs text-text/50">
              Em até 3x sem juros no cartão · 5% de desconto no PIX
            </p>

            {/* Quantidade */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-text/70">Quantidade</span>
                <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="text-primary hover:text-primary-dark transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(selectedVariation.stock, q + 1))}
                    className="text-primary hover:text-primary-dark transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <span className="text-xs text-text/50">
                {selectedVariation.stock} disponíveis
              </span>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button variant='warning' fullWidth>
                 Adicionar ao carrinho
              </Button>

              <Button variant='success' fullWidth>
                Comprar agora
              </Button>
            
            </div>

            {/* Ações secundárias */}
            <div className="flex items-center justify-between pt-1">
              <button className="flex items-center gap-1.5 text-sm text-text/60 hover:text-primary transition-colors">
                <Heart size={15} />
                Salvar nos favoritos
              </button>
              <button className="flex items-center gap-1.5 text-sm text-text/60 hover:text-primary transition-colors">
                <Share2 size={15} />
                Compartilhar
              </button>
            </div>
          </div>

          {/* Entrega + proteção */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">🚚</span>
              <div>
                <p className="text-sm font-semibold text-text">Entrega para hoje</p>
                <p className="text-xs text-text/50">Chega {product.deliveryDate}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-sm font-semibold text-text">Compra protegida</p>
                <p className="text-xs text-text/50">Devolução grátis em 7 dias</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sobre + Destaques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl mb-3">Sobre esta peça</h2>
          <p className="text-sm text-text/70 leading-relaxed">{product.about}</p>
        </div>
        <div>
          <h2 className="text-2xl mb-3">Destaques do produto</h2>
          <ul className="flex flex-col gap-2">
            {product.highlights.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-text/70">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      
      <ReviewList productId={product.id} />
      <RelatedProducts />

    </div>
  )
}