import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import { type PaymentInfo } from '../../../../schemas/order'
import { useOrder } from '../../../../hooks/orders/useOrders'

export function PaymentPage() {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const { state } = useLocation()

  const orderIds: number[] | undefined = state?.order_ids
  const checkoutGroupId: string | undefined = state?.checkout_group_id
  const payment: PaymentInfo | undefined = state?.payment_info
  // opcional: some se você ainda não adicionou total_amount ao state da ShippingPage (ver nota abaixo)
  const totalAmount: number | undefined = state?.total_amount

  // Página só faz sentido chegando do checkout (state em memória).
  // Se foi acessada direto / após F5, não tem como montar o QR Code nem fazer polling.
  useEffect(() => {
    if (!payment || !orderIds?.length) {
      navigate('/cart', { replace: true })
    }
  }, [payment, orderIds, navigate])

  const primaryOrderId = orderIds?.[0]

  // const expiresAtMs =  payment?.expires_at
  //   ? new Date(payment.expires_at).getTime()
  //   : 0

  const [timeLeft, setTimeLeft] = useState<number>(() =>
  payment?.expires_at
    ? Math.max(0, Math.floor((new Date(payment.expires_at).getTime() - Date.now()) / 1000))
    : 0
  )

  // Timer visual de contagem regressiva
  useEffect(() => {
    if (timeLeft <= 0 || !payment) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, payment])

  // Polling real do status do pedido (o hook useOrder já faz refetchInterval
  // enquanto o status não for PAID/EXPIRED — ver ajuste no useOrders.ts)
  const { data: order } = useOrder(primaryOrderId)

  useEffect(() => {
    if (!order) return

    if (order.status === 'PAID') {
      navigate(`/checkout/success/${checkoutGroupId}`, {
        replace: true,
        state: { order_ids: orderIds },
      })
    }

    if (order.status === 'EXPIRED') {
      navigate('/checkout/expired', { replace: true })
    }
  }, [order, checkoutGroupId, orderIds, navigate])

  async function handleCopy() {
    if (!payment) return
    await navigator.clipboard.writeText(payment.qr_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const expired = timeLeft <= 0

  const getTimeColor = () => {
    if (expired) return 'text-danger'
    if (timeLeft <= 300) return 'text-danger'
    if (timeLeft <= 600) return 'text-warning'
    return 'text-primary'
  }

  // Enquanto não tem payment_info válido, o useEffect acima já dispara o
  // redirect — aqui só evita renderizar a tela vazia por um instante.
  if (!payment) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-sm text-text/50">Carregando pagamento...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-4 items-center mx-auto justify-center">
        <h2 className="text-3xl font-bold mb-4">Verificar pagamento</h2>

        <div className="bg-card rounded-2xl p-6 flex flex-col gap-6 w-full max-w-md">

          {totalAmount !== undefined && (
            <div className="text-center">
              <p className="text-base font-semibold text-text">
                Total a pagar: <span className="font-bold text-xl">{formatCurrency(totalAmount)}</span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1.5 text-center">
            <p className="text-sm font-semibold text-text">
              Escaneie o QR Code abaixo para pagar
            </p>
            <p className="text-xs text-text/50">
              O pagamento é instantâneo e o pedido será confirmado em segundos
            </p>
          </div>

          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-2xl border border-primary/10">
              <img
                src={`data:image/png;base64,${payment.qr_code_base64}`}
                alt="QR Code PIX"
                className={`w-56 h-56 ${expired ? 'opacity-30 grayscale' : ''}`}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <p className={`
              text-sm font-semibold
              ${getTimeColor()}
              ${!expired && 'animate-pulse'}
            `}>
              {expired
                ? '⚠️ Tempo expirado'
                : `Tempo restante: ${formatTime(timeLeft)}`
              }
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-text">Código</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={payment.qr_code}
                disabled={expired}
                className="flex-1 bg-surface border border-primary/20 rounded-full px-4 py-2 text-xs text-text/60 outline-none disabled:opacity-50"
              />
              <button
                onClick={handleCopy}
                disabled={expired}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors shrink-0
                  ${expired
                    ? 'bg-neutral-400 text-white cursor-not-allowed'
                    : copied
                      ? 'bg-success text-white cursor-pointer'
                      : 'bg-primary text-white hover:bg-primary-dark cursor-pointer'
                  }
                `}
              >
                {expired ? <Copy size={14} /> : copied ? <Check size={14} /> : <Copy size={14} />}
                {expired ? 'Expirado' : copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {expired && (
            <div className="bg-danger/10 rounded-xl p-3 text-center">
              <p className="text-xs text-danger font-semibold">
                ⚠️ Este QR Code expirou. Gere um novo pagamento.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
