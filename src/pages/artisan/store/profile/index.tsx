import { useParams, Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { StorePublic } from '../../../../schemas/store'
import type { Product } from '../../../../schemas/product'
import { Button } from '../../../../components/ui/Button'
import { ProductCard } from '../../../../components/ui/ProductCard'
import {DashboardTabs} from '../../components/DashboardTabs'

// Mock — depois API
const MOCK_STORE: StorePublic = {
  id: 1,
  artisan_id: 'user-123',
  name: 'Val Laços',
  description: '🎀 Acessórios artesanais para meninas e mulheres\n✨ Feitos com amor, pensados com carinho\n🌟 Especial atenção ao universo infantil\n💝 Cada peça é um presente',
  category: { id: 1, name: 'Acessórios' },
  image: 'https://placehold.co/200x200?text=Val',
  banner: 'https://placehold.co/1200x300?text=Banner',
  address: {
    id: 1,
    street: 'Rua das Flores',
    number: 100,
    neighborhood: 'Centro',
    city: 'Alexandria',
    state: 'RN',
    zip_code: '59965-000',
    complement: null,
  },
  created_at: '2024-01-01T00:00:00',
  updated_at: '2024-01-01T00:00:00',
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Kit faixinhas rosas',
    description: 'Kit com 3 faixinhas em tons de rosa',
    store_id: 1,
    is_active: true,
    shopName: 'Val Laços',
    rating: 5,
    reviewCount: 24,
    monthlySales: 'Mais de 50 vendas no mês',
    discount: 10,
    deliveryDate: 'qui., 12 de jun.',
    freeShipping: true,
    variations: [
      {
        id: 1,
        price: 83.50,
        stock: 15,
        color: 'Rosa',
        size: 'U',
        weight: 0.1,
        length: 10,
        width: 8,
        height: 2,
        sku: 'KIT-001',
        images: [{ id: 1, url: 'https://placehold.co/400x400?text=Kit+Rosas', is_primary: true }],
      },
    ],
  },
  {
    id: 2,
    name: 'Laço pérola com pontas',
    description: 'Laço delicado com detalhes em pérola',
    store_id: 1,
    is_active: true,
    shopName: 'Val Laços',
    rating: 4.5,
    reviewCount: 18,
    monthlySales: 'Mais de 30 vendas no mês',
    discount: 5,
    deliveryDate: 'qui., 12 de jun.',
    freeShipping: true,
    variations: [
      {
        id: 2,
        price: 40.70,
        stock: 20,
        color: 'Branco',
        size: 'U',
        weight: 0.05,
        length: 10,
        width: 8,
        height: 2,
        sku: 'LAC-002',
        images: [{ id: 2, url: 'https://placehold.co/400x400?text=Laco+Perola', is_primary: true }],
      },
    ],
  },
  {
    id: 3,
    name: 'Tiara Boutique Duplo',
    description: 'Tiara dupla em cetim premium',
    store_id: 1,
    is_active: true,
    shopName: 'Val Laços',
    rating: 5,
    reviewCount: 32,
    monthlySales: 'Mais de 80 vendas no mês',
    deliveryDate: 'ter., 17 de jun.',
    fastDelivery: true,
    variations: [
      {
        id: 3,
        price: 40.00,
        stock: 10,
        color: 'Roxo',
        size: 'U',
        weight: 0.05,
        length: 15,
        width: 5,
        height: 3,
        sku: 'TIA-003',
        images: [{ id: 3, url: 'https://placehold.co/400x400?text=Tiara+Roxa', is_primary: true }],
      },
    ],
  },
  {
    id: 4,
    name: 'Laço Infantil Clássico Princesa',
    description: 'Laço artesanal feito à mão em cetim premium',
    store_id: 1,
    is_active: true,
    shopName: 'Val Laços',
    rating: 4,
    reviewCount: 15,
    monthlySales: 'Mais de 25 vendas no mês',
    deliveryDate: 'sex., 13 de jun.',
    freeShipping: false,
    variations: [
      {
        id: 4,
        price: 30.00,
        stock: 25,
        color: 'Rosa',
        size: 'U',
        weight: 0.1,
        length: 10,
        width: 8,
        height: 2,
        sku: 'LAC-004',
        images: [{ id: 4, url: 'https://placehold.co/400x400?text=Laco+Classico', is_primary: true }],
      },
    ],
  },
]

export function StoreProfile() {
  const { id } = useParams()

  const store = MOCK_STORE
  const products = MOCK_PRODUCTS

  return (
    <div className="max-w-6xl mx-auto">
      <div className='mb-4'>
        <DashboardTabs />

      </div>
     
      <div className="relative">
        <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-surface">
          {store.banner ? (
            <img
              src={store.banner}
              alt={`Banner ${store.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5" />
          )}
        </div>

     
        <div className="absolute -bottom-12 left-6 md:left-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-card border-4 border-card overflow-hidden shadow-lg">
            {store.image ? (
              <img
                src={store.image}
                alt={`Logo ${store.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {store.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

    
      <div className="mt-16 md:mt-20 px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="font-title text-3xl font-bold text-primary">
              {store.name}
            </h1>
            <p className="text-sm text-text/60 mt-1">
              {store.category.name}
            </p>
          </div>

          <Link to="/artisan/store/edit">
            <Button variant="primary" size="sm">
              Editar Loja
            </Button>
          </Link>
        </div>

        {/* Descrição */}
        {store.description && (
          <div className="mt-6 space-y-1.5">
            {store.description.split('\n').map((line, index) => (
              <p key={index} className="text-sm text-text/80">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Localização */}
        {store.address && (
          <div className="flex items-center gap-2 mt-4 text-sm text-text/60">
            <MapPin size={14} />
            <span>
              {store.address.city}, {store.address.state}
            </span>
          </div>
        )}
      </div>

      {/* Produtos */}
      <div className="mt-10 px-6 md:px-10">
        <h2 className="font-title text-xl font-bold text-text mb-6">
          Produtos ({products.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text/60">Esta loja ainda não tem produtos</p>
          </div>
        )}
      </div>
    </div>
  )
}