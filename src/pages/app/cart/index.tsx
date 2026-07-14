import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { CartProductCard } from './components/CartProductCard'
import { OrderSummary } from './components/OrderSummary'
import { useCartWithDetails } from '../../../hooks/orders/useCartWithDetails'
import { useUpdateCartItem, useRemoveCartItem } from '../../../hooks/orders/useCart'

export function CartPage() {
  const navigate = useNavigate()

  const { items, total_price, isPending, error } = useCartWithDetails()
  const updateCartItem = useUpdateCartItem()
  const removeCartItem = useRemoveCartItem()

  function handleRemove(product_variant_id: string) {
    removeCartItem.mutate(product_variant_id)
  }

  function handleQuantityChange(product_variant_id: string, quantity: number) {
    if (quantity < 1) return
    updateCartItem.mutate({ itemId: product_variant_id, data: { quantity } })
  }

  if (isPending) {
    return <p className="text-center py-20 text-text/50">Carregando carrinho...</p>
  }

  if (error) {
    return <p className="text-center py-20 text-danger">Erro ao carregar o carrinho.</p>
  }

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
          <span className="text-sm text-text/50">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </span>
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

      {/* Resumo */}
      <div className="w-full lg:w-auto lg:min-w-[350px]">
        <OrderSummary
          subtotal={total_price}
          shipping={null}
          onContinue={() => navigate('/checkout/shipping')}
          onAddProducts={() => navigate('/')}
        />
      </div>

    </div>
  )
}