import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { CartProductCard } from './components/CartProductCard'
import type { CartItemDisplay } from '../../../schemas/cart'

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
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <ShoppingCart size={48} className="text-primary/20" />
        <p className="text-lg font-semibold text-text">Seu carrinho está vazio</p>
        <p className="text-sm text-text/50">Explore os produtos e adicione ao carrinho</p>
        <Button onClick={() => navigate('/')}>Ver produtos</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">

      {/* Lista */}
      <div className="flex-1 bg-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Meu Carrinho</h2>
          <span className="text-sm text-text/50">{items.length} itens</span>
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

      
      <div className="bg-card rounded-2xl p-6 flex flex-col gap-4 w-full lg:w-80 lg:sticky lg:top-4">
        <h3 className="font-title text-lg text-primary font-bold">Resumo do Pedido</h3>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text/60">Subtotal</span>
            <span className="font-medium">
              R$ {subtotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text/60">Frete</span>
            <span className={hasFreeShipping ? 'text-success font-medium' : 'font-medium'}>
              {hasFreeShipping ? 'Grátis' : 'A calcular'}
            </span>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-3 flex items-center justify-between">
          <span className="font-semibold text-text">Total</span>
          <span className="text-xl text-primary font-bold">
            R$ {subtotal.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Button fullWidth size="md" variant="success">
            Continuar
          </Button>
          <Button
            fullWidth
            size="md"
            variant="warning"
            onClick={() => navigate('/')}
          >
            Adicionar produtos
          </Button>
        </div>
      </div>

    </div>
  )
}