import { ProductCard } from '../../../../components/ui/ProductCard'
import { useProducts } from '../../../../hooks/catalogs/useProducts'

export function RelatedProducts() {
  const {data:products} = useProducts()
  return (
    <section className="mt-12">
      <h2 className="text-2xl mb-6">Você também pode gostar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}