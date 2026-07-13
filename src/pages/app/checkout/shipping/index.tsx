import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { OrderSummary } from '../../../app/cart/components/OrderSummary'
import { orderCreatedSchema } from '../../../../schemas/order'
import type { ShippingOption } from '../../../../schemas/shipping'
import type { Address } from '../../../../schemas/user'


// mock — GET /api/v1/accounts/addresses/
const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    street: 'Rua das Araucarias',
    number: 355,
    neighborhood: 'Bairro Centro',
    city: 'Pau dos Ferros',
    state: 'RN',
    zip_code: '59900000',
    is_main: true,
    complement: null,
  },
]

// mock — GET /api/v1/checkout/shipping/{address_id}
const MOCK_SHIPPING: { cheapest: ShippingOption; fastest: ShippingOption } = {
  cheapest: {
    name: 'Econômico',
    total_price: 0,
    max_delivery_time: 7,
    stores_breakdown: {},
  },
  fastest: {
    name: 'Expresso',
    total_price: 15.90,
    max_delivery_time: 3,
    stores_breakdown: {},
  },
}

const SUBTOTAL = 86.64


// true  = Mercado Pago gerou o QR Code com sucesso → vai pra tela de pagamento
// false = Mercado Pago falhou → vai pra tela de erro
const MOCK_PAYMENT_SUCCESS = true

async function mockCreateOrder() {
  if (!MOCK_PAYMENT_SUCCESS) {
    throw {
      response: {
        data: {
          detail: 'Pedido criado! Porém, ocorreu um erro ao gerar o pagamento. Acesse Meus Pedidos para tentar pagar novamente.',
        },
      },
    }
  }

  return {
    data: {
      message: 'Pedido gerado',
      checkout_group_id: 'mock-group-id',
      order_ids: [1, 2], // simula um carrinho com pedidos de 2 lojas diferentes
      payment_info: {
        id: 'mp-payment-123',
        qr_code_base64: '', // não é usado — o PaymentPage gera o próprio mock de QR
        qr_code: '00020126580014br.gov.bcb.pix0136a1b2c3-teste-fake6304ABCD',
      },
    },
  }
}


export function ShippingPage() {
  const navigate = useNavigate()
  const [selectedAddress, setSelectedAddress] = useState<number>(MOCK_ADDRESSES[0]?.id)
  const [selectedShipping, setSelectedShipping] = useState<'cheapest' | 'fastest'>('cheapest')

  const shippingOptions = [
    { key: 'cheapest' as const, option: MOCK_SHIPPING.cheapest },
    { key: 'fastest' as const, option: MOCK_SHIPPING.fastest },
  ]

  const currentShipping = MOCK_SHIPPING[selectedShipping]
  const shippingPrice = currentShipping.total_price

  async function handleFinalizarCompra() {
    try {
      // trocar pela chamada real e remover mockCreateOrder:
      // const response = await api.post('/orders', {
      //   address_id: String(selectedAddress),
      //   payment_method: 'pix',
      //   shipping_method: currentShipping.name,
      // })
      const response = await mockCreateOrder() // MOCK

      const data = orderCreatedSchema.parse(response.data)

      navigate('/checkout/payment', {
        state: {
          payment_info: data.payment_info,
          order_ids: data.order_ids, // ← manda TODOS os ids do grupo, não só o primeiro
          checkout_group_id: data.checkout_group_id,
        },
      })
    } catch (error: any) {
      navigate('/checkout/payment-error', {
        state: {
          message: error?.response?.data?.detail ?? 'Erro ao processar pagamento.',
        },
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start w-full px-4 lg:px-0">

      <div className="flex-1 flex flex-col gap-4 w-full">
        <h2 className="text-xl lg:text-2xl font-bold">Opções de Entrega</h2>

        <div className="bg-card rounded-2xl p-4 lg:p-6 flex flex-col gap-4">
          <h3 className="text-center font-semibold text-text/90 text-lg lg:text-xl">
            Selecione o Endereço
          </h3>

          <div className="flex flex-col gap-3">
            {MOCK_ADDRESSES.map(address => (
              <label
                key={address.id}
                className={`
                  flex items-start gap-3 p-3 lg:p-4 rounded-xl border-2 cursor-pointer transition-colors
                  ${selectedAddress === address.id
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
                      Casa
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-text mt-1">
                    <Home size={14} className="text-primary shrink-0" />
                    <span className="break-words">{address.street}, {address.number}</span>
                  </div>
                  <p className="text-xs text-text/60 ml-5">
                    {address.neighborhood}
                  </p>
                  <p className="text-xs text-text/60 ml-5">
                    {address.city}, {address.state} - {address.zip_code}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <div className='flex justify-start'>
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

        <div className="bg-card rounded-2xl p-4 lg:p-6 flex flex-col gap-4">
          <h3 className="text-center font-semibold text-text/90 text-lg lg:text-xl">
            Selecione o Frete
          </h3>

          <div className="flex flex-col gap-3">
            {shippingOptions.map(({ key, option }) => (
              <label
                key={key}
                className={`
                  flex items-start gap-3 p-3 lg:p-4 rounded-xl border-2 cursor-pointer transition-colors
                  ${selectedShipping === key
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
                    <p className="text-sm font-semibold text-text truncate">{option.name}</p>
                    <span className={`${option.total_price === 0 ? 'text-success' : 'text-text'} text-sm font-semibold whitespace-nowrap`}>
                      {option.total_price === 0
                        ? 'Grátis'
                        : `R$ ${option.total_price.toFixed(2).replace('.', ',')}`
                      }
                    </span>
                  </div>
                  <p className="text-xs text-text/50 mt-0.5">
                    Receba em {option.max_delivery_time} dias úteis
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-auto lg:min-w-[350px]">
        <OrderSummary
          subtotal={SUBTOTAL}
          shipping={shippingPrice}
          onContinue={handleFinalizarCompra}
          onAddProducts={() => navigate('/')}
        />
      </div>

    </div>
  )
}