import {ProductCard} from '../../components/ui/ProductCard'
import {Carousel} from '../../components/ui/Carousel'
import {type Product} from '../../schemas/product'
import {Banner} from '../../components/ui/Banner'
import { useProducts } from '../../hooks/catalogs/useProducts'


export function Home(){
  const { data, isPending, error } = useProducts();
  if (isPending) {
    return <></>;
  }

  if (error) {
    return <></>;
  }
  console.log(data);
  return(<>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Banner
        title="13ª Feirinha da Barriguda"
        subtitle="Cidade de Alexandria-RN"
        variant="warm"
      />

      <Banner
        title="Coleção Casamento"
        subtitle="Detalhes feitos à mão"
        variant="light"
      />

    </div>
    <section className="min-w-0">
    <h2 className='text-2xl mb-6 font-bold'>Achadinhos</h2>
    <Carousel>
      {data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Carousel>
  </section>
    
  </>)
}