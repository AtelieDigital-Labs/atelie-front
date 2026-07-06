import { Minus, Plus } from 'lucide-react'
import type { CartItemDisplay } from '../../../../schemas/cart'

type CartProductCardProps = {
  item: CartItemDisplay
  onRemove: (product_variant_id: string) => void
  onQuantityChange: (product_variant_id: string, quantity: number) => void
}

export function CartProductCard({ item, onRemove, onQuantityChange }: CartProductCardProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-primary/10 last:border-0">

      <div className="w-20 h-20 rounded-xl bg-surface overflow-hidden shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-text line-clamp-1">{item.name}</p>
          <button
            onClick={() => onRemove(item.product_variant_id)}
            className="text-xs text-danger hover:text-danger-dark transition-colors shrink-0 cursor-pointer"
          >
            Remover
          </button>
        </div>

        <p className="text-xs text-text/50 line-clamp-2">{item.description}</p>
        <p className="text-xs text-text/50">
          Vendido por: <span className="text-primary">{item.shopName}</span>
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-bold text-text">
            R$ {item.unit_price.toFixed(2).replace('.', ',')}
          </span>

          <div className="flex items-center gap-2 border border-primary/20 rounded-full px-3 py-1">
            <button
              onClick={() => onQuantityChange(item.product_variant_id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="text-primary hover:text-primary-dark transition-colors disabled:opacity-30 cursor-pointer"
            >
              <Minus size={12} />
            </button>
            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.product_variant_id, item.quantity + 1)}
              className="text-primary hover:text-primary-dark transition-colors cursor-pointer"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}