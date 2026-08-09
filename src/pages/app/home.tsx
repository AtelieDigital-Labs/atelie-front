import {ProductCard} from '../../components/ui/ProductCard'
import {Carousel} from '../../components/ui/Carousel'
import {type Product} from '../../schemas/product'
import {Banner} from '../../components/ui/Banner'

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laço Infantil Clássico Princesa em Cetim',
    description: 'Laço artesanal feito à mão em cetim premium, ideal para ocasiões especiais e festas infantis.',
    store_id: 1,
    is_active: true,
    shopName: 'Ateliê Bia',
    rating: 5,
    reviewCount: 312,
    monthlySales: 'Mais de 200 vendas no mês passado',
    discount: 20,
    deliveryDate: 'qui., 12 de jun.',
    freeShipping: true,
    variations: [
      {
        id: 1,
        price: 30.00,
        sku: 'LAC-001',
        stock: 15,
        color: 'Rosa',
        size: 'U',
        weight: 0.1,
        length: 10,
        width: 8,
        height: 2,
        images: [
          { id: 1, url: 'https://placehold.co/400x400?text=Laco', is_primary: true },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Prato De Sobremesa em Cerâmica Artesanal',
    description: 'Peça única torneada e esmaltada à mão, tons terrosos que valorizam a mesa posta.',
    store_id: 2,
    is_active: true,
    shopName: 'Cerâmica Sálvia',
    rating: 4,
    reviewCount: 187,
    monthlySales: 'Mais de 100 vendas no mês passado',
    discount: 20,
    deliveryDate: 'qui., 12 de jun.',
    freeShipping: true,
    variations: [
      {
        id: 2,
        price: 48.64,
        sku: 'PRA-001',
        stock: 8,
        color: null,
        size: null,
        weight: 0.4,
        length: 20,
        width: 20,
        height: 3,
        images: [
          { id: 2, url: 'https://placehold.co/400x400?text=Prato', is_primary: true },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Tiara de Pompom com Pérolas Aplicadas',
    description: 'Tiara delicada com pompons artesanais e pérolas, conforto e charme para o dia a dia.',
    store_id: 3,
    is_active: true,
    shopName: 'Tiara Boutique',
    rating: 3.5,
    reviewCount: 98,
    monthlySales: 'Mais de 80 vendas no mês passado',
    deliveryDate: 'ter., 17 de jun.',
    fastDelivery: true,
    variations: [
      {
        id: 3,
        price: 30.00,
        sku: 'TIA-001',
        stock: 20,
        color: 'Dourado',
        size: 'U',
        weight: 0.05,
        length: 15,
        width: 5,
        height: 3,
        images: [
          { id: 3, url: 'https://placehold.co/400x400?text=Tiara', is_primary: true },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Vaso Decorativo em Argila Natural',
    description: 'Vaso artesanal moldado à mão com argila natural, perfeito para decoração de interiores.',
    store_id: 4,
    is_active: true,
    shopName: 'Casa de Barro',
    rating: 4.5,
    reviewCount: 54,
    deliveryDate: 'sex., 13 de jun.',
    freeShipping: true,
    variations: [
      {
        id: 4,
        price: 89.90,
        sku: 'VAS-001',
        stock: 5,
        color: 'Terracota',
        size: 'M',
        weight: 0.8,
        length: 15,
        width: 15,
        height: 25,
        images: [],
      },
    ],
  },
  {
    id: 5,
    name: 'Cesta de Piquenique em Vime com Forro',
    description: 'Cesta de piquenique feita à mão em vime natural, com forro de algodão removível.',
    store_id: 5,
    is_active: true,
    shopName: 'Vime & Arte',
    rating: 4.8,
    reviewCount: 76,
    monthlySales: 'Mais de 50 vendas no mês passado',
    deliveryDate: 'seg., 16 de jun.',
    fastDelivery: true,
    variations: [
      {
        id: 5,
        price: 120.00,
        sku: 'CES-001',
        stock: 10,
        color: 'Natural',
        size: 'G',
        weight: 1.2,
        length: 40,
        width: 30,
        height: 20,
        images: [
          { id: 4, url : 'https://placehold.co/400x400?text=Cesta', is_primary: true },
        ],
      },
    ],  
  }
]


export function Home(){
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
      {MOCK_PRODUCTS.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Carousel>
  </section>
    
  </>)
}