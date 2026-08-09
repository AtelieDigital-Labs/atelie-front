import { z } from 'zod'
import { productSchema } from '../../../../schemas/product'
import { Link } from 'react-router-dom'


const recentProductSchema = productSchema.pick({
  id: true,
  name: true,
  is_active: true,
}).extend({
  price: z.number(),
  stock: z.number(),
  image: z.string().optional(),
})

type RecentProduct = z.infer<typeof recentProductSchema>


const MOCK_RECENT_RAW = [
  { id: 1, name: 'Laço Infantil Luxo Pérola Branco', price: 45.00, stock: 20,  is_active: true },
  { id: 2, name: 'Laço Infantil Festa Glamour', price: 30.00, stock: 8,  is_active: true },
  { id: 3, name: 'Laço Infantil Charmoso Preto Fashion', price: 40.00, stock: 15,  is_active: true },
  { id: 4, name: 'Tiara de Pompom', price: 30.00, stock: 5,  is_active: true },
  { id: 5, name: 'Laço Infantil Brilho Suave Encantado', price: 30.00, stock: 10,  is_active: true },
]

const MOCK_RECENT: RecentProduct[] = MOCK_RECENT_RAW.map(item => 
  recentProductSchema.parse(item)
)

function StockLabel({ stock }: { stock: number }) {
  if (stock === 0) {
    return <span className="text-xs text-danger">Sem estoque</span>
  }
  if (stock <= 5) {
    return <span className="text-xs text-warning">{stock} em estoque</span>
  }
  return <span className="text-xs text-success">{stock} em estoque</span>
}

export function RecentProducts() {
  return (
    <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-title text-lg text-primary">Produtos Recentes</h3>
        <Link
          to="/artisan/products"
          className="text-xs text-primary font-semibold hover:underline"
        >
          Ver todos
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {/* VOU SUBSTITUIR PELO COMPONENTE POSTERIORMENTE */}
        {MOCK_RECENT.map(product => (
          <div key={product.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface shrink-0 overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{product.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-text/60">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-text/30">•</span>
                <StockLabel stock={product.stock} />
              </div>
            </div>

            {product.is_active && (
              <span className="text-xs text-success border border-success/30 rounded-full px-2.5 py-0.5 shrink-0">
                Ativo
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}