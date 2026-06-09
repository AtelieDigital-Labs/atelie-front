
import { Header } from "./components/Header"

import { ProductCard } from "./components/ui/ProductCard"
import {type Product} from './dtos/product'


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
]


function App() {

  return (
   <div>
     <Header/>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 ">
       {MOCK_PRODUCTS.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
     </div>
   
    
   </div>
    
 
   
  )
}

export default App
