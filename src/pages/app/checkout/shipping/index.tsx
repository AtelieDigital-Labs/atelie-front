import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { OrderSummary } from '../../../app/cart/components/OrderSummary'
import { useListAddresses } from "../../../../hooks/accounts/useAddresses";
import { useShippingOptions } from "../../../../hooks/orders/useCheckout";
import { useCreateOrder } from "../../../../hooks/orders/useOrders";
import { useCartWithDetails } from '../../../../hooks/orders/useCartWithDetails'


export function ShippingPage() {
  const navigate = useNavigate()

  // Carrinho
  const {
    total_price,
    isPending: loadingCart,
    error: cartError,
  } = useCartWithDetails()

  // Endereços
  const {
    data: addresses = [],
    isPending: loadingAddresses,
  } = useListAddresses()

  const [selectedAddress, setSelectedAddress] = useState<number>()
  const [selectedShipping, setSelectedShipping] =
    useState<'cheapest' | 'fastest'>('cheapest')

  // Seleciona automaticamente o endereço principal
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const mainAddress =
        addresses.find(address => address.is_main) ?? addresses[0]

      setSelectedAddress(mainAddress.id)
    }
  }, [addresses, selectedAddress])

  // Fretes
  const {
    data: shipping,
    isPending: loadingShipping,
  } = useShippingOptions(selectedAddress?.toString())

  const shippingOptions = shipping
    ? [
        {
          key: 'cheapest' as const,
          option: shipping.cheapest,
        },
        {
          key: 'fastest' as const,
          option: shipping.fastest,
        },
      ]
    : []

  const currentShipping = shipping?.[selectedShipping]
  const shippingPrice = currentShipping?.total_price ?? 0

  // Criar pedido
  const createOrder = useCreateOrder()

  async function handleFinalizarCompra() {
    if (!selectedAddress || !currentShipping) return

    try {
      const data = await createOrder.mutateAsync({
        address_id: String(selectedAddress),
        payment_method: 'pix',
        shipping_method: currentShipping.name,
      })

      navigate('/checkout/payment', {
        state: {
          payment_info: data.payment_info,
          order_ids: data.order_ids,
          checkout_group_id: data.checkout_group_id,
        },
      })
    } catch (error: any) {
      navigate('/checkout/payment-error', {
        state: {
          message:
            error?.response?.data?.detail ??
            'Erro ao processar pagamento.',
        },
      })
    }
  }

  // Loading do carrinho e endereços (o frete é tratado localmente, pois
  // fica "pending" para sempre quando ainda não há endereço selecionado)
  if (loadingCart || loadingAddresses) {
    return (
      <p className="text-center py-20 text-text/50">
        Carregando...
      </p>
    )
  }

  if (cartError) {
    return (
      <p className="text-center py-20 text-danger">
        Erro ao carregar carrinho.
      </p>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start w-full px-4 lg:px-0">

      <div className="flex-1 flex flex-col gap-4 w-full">
        <h2 className="text-xl lg:text-2xl font-bold">
          Opções de Entrega
        </h2>

        <div className="bg-card rounded-2xl p-4 lg:p-6 flex flex-col gap-4">
          <h3 className="text-center font-semibold text-text/90 text-lg lg:text-xl">
            Selecione o Endereço
          </h3>

          <div className="flex flex-col gap-3">
            {addresses.length === 0 ? (
              <p className="text-text/50 text-center">
                Nenhum endereço cadastrado.
              </p>
            ) : (
              addresses.map(address => (
                <label
                  key={address.id}
                  className={`
                    flex items-start gap-3 p-3 lg:p-4 rounded-xl border-2 cursor-pointer transition-colors
                    ${
                      selectedAddress === address.id
                        ? 'border-primary bg-primary/5'
                        : 'border-primary/10 hover:border-primary/30'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddress === address.id}
                    onChange={() => setSelectedAddress(address.id)}
                    className="accent-primary mt-0.5"
                  />

                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    {address.is_main && (
                      <span className="text-xs bg-warning/20 text-warning font-semibold px-2 py-0.5 rounded-full w-fit">
                        Principal
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 text-sm text-text mt-1">
                      <Home
                        size={14}
                        className="text-primary shrink-0"
                      />
                      <span className="break-words">
                        {address.street}, {address.number}
                      </span>
                    </div>

                    <p className="text-xs text-text/60 ml-5">
                      {address.neighborhood}
                    </p>

                    <p className="text-xs text-text/60 ml-5">
                      {address.city}, {address.state} - {address.zip_code}
                    </p>

                    {address.complement && (
                      <p className="text-xs text-text/60 ml-5">
                        {address.complement}
                      </p>
                    )}
                  </div>
                </label>
              ))
            )}
          </div>

          <div className="flex justify-start">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/profile/address')}
              className="w-full sm:w-auto"
            >
              Adicionar Novo Endereço
            </Button>
          </div>
        </div>

        {/* Fretes */}
        <div className="bg-card rounded-2xl p-4 lg:p-6 flex flex-col gap-4">
          <h3 className="text-center font-semibold text-text/90 text-lg lg:text-xl">
            Selecione o Frete
          </h3>

          <div className="flex flex-col gap-3">
            {loadingShipping ? (
              <p className="text-center text-text/50">
                Carregando opções de frete...
              </p>
            ) : shippingOptions.length === 0 ? (
              <p className="text-center text-text/50">
                Nenhuma opção de frete encontrada.
              </p>
            ) : (
              shippingOptions.map(({ key, option }) => (
                <label
                  key={key}
                  className={`
                    flex items-start gap-3 p-3 lg:p-4 rounded-xl border-2 cursor-pointer transition-colors
                    ${
                      selectedShipping === key
                        ? 'border-primary bg-primary/5'
                        : 'border-primary/10 hover:border-primary/30'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={key}
                    checked={selectedShipping === key}
                    onChange={() => setSelectedShipping(key)}
                    className="accent-primary mt-0.5"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-text truncate">
                        {option.name}
                      </p>

                      <span
                        className={`${
                          option.total_price === 0
                            ? 'text-success'
                            : 'text-text'
                        } text-sm font-semibold whitespace-nowrap`}
                      >
                        {option.total_price === 0
                          ? 'Grátis'
                          : `R$ ${option.total_price
                              .toFixed(2)
                              .replace('.', ',')}`}
                      </span>
                    </div>

                    <p className="text-xs text-text/50 mt-0.5">
                      Receba em {option.max_delivery_time} dias úteis
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-auto lg:min-w-[350px]">
        <OrderSummary
          subtotal={total_price}
          shipping={shippingPrice}
          onContinue={handleFinalizarCompra}
          onAddProducts={() => navigate('/')}
          loading={createOrder.isPending}
        />
      </div>

    </div>
  )
}
