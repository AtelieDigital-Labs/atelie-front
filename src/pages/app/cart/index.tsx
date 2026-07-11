import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { CartProductCard } from './components/CartProductCard'
import type { CartItemDisplay } from '../../../schemas/cart'
import {OrderSummary} from './components/OrderSummary'

// mock — simulando GET /api/v1/carts/ + GET /api/v1/catalog/products/
const MOCK_CART: CartItemDisplay[] = [
  {
    product_variant_id: 'var-002',
    store_id: 'store-002',
    quantity: 1,
    unit_price: 48.64,
    name: 'Prato De Sobremesa Copa E Cia Vivant Em Cerâmica Sálvia',
    description: 'Prato De Sobremesa Copa E Cia Vivant Em Cerâmica Sálvia',
    shopName: 'Encantos',
    image: 'https://placehold.co/200x200?text=Prato',
    freeShipping: true,
  },
  {
    product_variant_id: 'var-004',
    store_id: 'store-001',
    quantity: 1,
    unit_price: 38.00,
    name: 'Laço parzinho cinderela',
    description: 'Laço infantil em tom azul suave, confeccionado com aramado de pérolas e flores delicadas.',
    shopName: 'VL Princesa Estilosa',
    image: 'https://placehold.co/200x200?text=Laco',
    freeShipping: false,
  },
]

export function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItemDisplay[]>(MOCK_CART)

  function handleRemove(product_variant_id: string) {
    // mock — DELETE /api/v1/carts/items/{item_id}
    setItems(prev => prev.filter(item => item.product_variant_id !== product_variant_id))
  }

  function handleQuantityChange(product_variant_id: string, quantity: number) {
    // mock — PATCH /api/v1/carts/items/{item_id} { quantity }
    setItems(prev => prev.map(item =>
      item.product_variant_id === product_variant_id ? { ...item, quantity } : item
    ))
  }

  const subtotal = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0)
  const hasFreeShipping = items.every(item => item.freeShipping)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
        <ShoppingCart size={48} className="text-primary/20" />
        <p className="text-lg font-semibold text-text">Seu carrinho está vazio</p>
        <p className="text-sm text-text/50">Explore os produtos e adicione ao carrinho</p>
        <Button onClick={() => navigate('/')}>Ver produtos</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start w-full">

      {/* Lista */}
      <div className="flex-1 bg-card rounded-2xl p-4 lg:p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl lg:text-2xl font-bold">Meu Carrinho</h2>
          <span className="text-sm text-text/50">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
        </div>

        {items.map(item => (
          <CartProductCard
            key={item.product_variant_id}
            item={item}
            onRemove={handleRemove}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>

      
      <div className="w-full lg:w-auto lg:min-w-[350px]">
        <OrderSummary
          subtotal={subtotal}
          shipping={hasFreeShipping ? 0 : null}
          onContinue={() => navigate('/checkout/shipping')}
          onAddProducts={() => navigate('/')}
        />
      </div>

    </div>
  )
}