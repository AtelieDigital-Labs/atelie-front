import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../../../components/ui/ProductCard";
import { useProductsSearch } from "../../../hooks/catalogs/useProducts";

export function SearchPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category");

  const categoryId = category ? Number(category) : undefined;

  const {
    data: products = [],
    isLoading,
    isError,
  } = useProductsSearch(query, categoryId);

  const title = query
    ? `Resultados para "${query}"`
    : category
    ? `Categoria`
    : "Todos os produtos";

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        Carregando...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-20">
        Erro ao carregar os produtos.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{title}</h2>

        <span className="text-sm text-text/50">
          {products.length} produtos encontrados
        </span>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <p className="text-xl font-semibold text-primary">
            Nenhum produto encontrado
          </p>

          <p className="text-sm text-text/50">
            Tente buscar por outro termo ou explore as categorias.
          </p>
        </div>
      )}
    </div>
  );
}