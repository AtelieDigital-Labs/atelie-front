import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import QRCode from 'qrcode' // irei remover import e dependência (npm uninstall qrcode) quando conectar com o back
import type { PaymentInfo } from '../../../../schemas/order'


const PIX_EXPIRATION_MINUTES = 30 

const MOCK_PAYMENT_AMOUNT = 86.64

const MOCK_PIX_PAYLOAD =
  '00020126580014br.gov.bcb.pix0136a1b2c3-teste-fake6304ABCD'

// gera o base64 do QR Code na hora, simulando o que o backend mandaria pronto
async function generateMockPayment(): Promise<PaymentInfo> {
  const dataUrl = await QRCode.toDataURL(MOCK_PIX_PAYLOAD)
  const qr_code_base64 = dataUrl.split(',')[1] // remove o prefixo "data:image/png;base64,"

  return {
    id: 'mp-payment-123',
    qr_code_base64,
    qr_code: MOCK_PIX_PAYLOAD,
    expires_at: new Date(Date.now() + PIX_EXPIRATION_MINUTES * 60 * 1000),
  }
}

export function PaymentPage() {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const [payment, setPayment] = useState<PaymentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<number>(0) 

  useEffect(() => {
    generateMockPayment().then((mock) => {
      setPayment(mock)
      setLoading(false)
      setTimeLeft(Math.max(0, Math.floor((mock.expires_at.getTime() - Date.now()) / 1000)))
    })
  }, [])

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

  // Formata o valor para moeda brasileira 
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

  if (loading || !payment) {
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
          
          {/* Valor a pagar */}
          <div className="text-center">
            <p className="text-base font-semibold text-text">
              Total a pagar: <span className="font-bold text-xl">{formatCurrency(MOCK_PAYMENT_AMOUNT)}</span>
            </p>
          </div>

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

          {/* Timer compacto estilo Amazon */}
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