import { useParams, Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { StorePublic } from '../../../../schemas/store'
import type { Product } from '../../../../schemas/product'
import { Button } from '../../../../components/ui/Button'
import { ProductCard } from '../../../../components/ui/ProductCard'
import {DashboardTabs} from '../../components/DashboardTabs'
import { useGetMeStore, useGetMeStoreProducts, useGetStore, useGetStoreProducts } from '../../../../hooks/catalogs/useStores'


export function StoreProfile() {
  const {id} = useParams()
  
  const storeId = id ? Number(id) : undefined;

  const meStoreQuery = useGetMeStore({
    enabled: storeId === undefined,
  });

  const storeQuery = useGetStore(storeId ?? 0, {
    enabled: storeId !== undefined,
  });

  const meStoreProductsQuery = useGetMeStoreProducts({
    enabled: storeId === undefined,
  });

  const storeProductsQuery = useGetStoreProducts(storeId ?? 0, {
    enabled: storeId !== undefined,
  });



  // 1. Condicional unificada e segura
  const isSpecificStore = storeId !== undefined;
  const store = isSpecificStore ? storeQuery.data : meStoreQuery.data;
  const products = isSpecificStore ? storeProductsQuery.data : meStoreProductsQuery.data;
  const isLoading = isSpecificStore ? storeQuery.isLoading : meStoreQuery.isLoading;
  const error = isSpecificStore ? storeQuery.error : meStoreQuery.error;

 
if (isLoading) {
  return <div>Carregando...</div>;
}

if (error) {
  return <div>Erro ao carregar a loja.</div>;
}

if (!store) {
  return <div>Loja não encontrada.</div>;
}

  return (
    <div className="max-w-6xl mx-auto">
      <div className='mb-4'>
        {!storeId && (
          <DashboardTabs />
        )}

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

          {!storeId && (<Link to="/artisan/store/edit">
            <Button variant="primary" size="sm">
              Editar Loja
            </Button>
          </Link>)}
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
          Produtos ({products?.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map(product => (
            <ProductCard key={product.id} product={product} isOwner={true} />
          ))}
        </div>

        {products?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text/60">Esta loja ainda não tem produtos</p>
          </div>
        )}
      </div>
    </div>
  )
}