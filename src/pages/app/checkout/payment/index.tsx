import { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import QRCode from 'qrcode' // irei remover import e dependência (npm uninstall qrcode) quando conectar com o back
import { Button} from  '../../../../components/ui/Button'

import type { PaymentInfo } from '../../../../schemas/order'


// payload fake só pra gerar um QR Code visualmente real
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
    expires_at: new Date(Date.now() + 30 * 60 * 1000), // agora + 30min
  }
}



export function PaymentPage() {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  // Quando conectar com o back:
  // const { state } = useLocation()
  // const payment = state?.payment_info as PaymentInfo | undefined
  const [payment, setPayment] = useState<PaymentInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // remover esse useEffect inteiro quando conectar com o back.
    // O payment_info virá pronto via state do navigate() na ShippingPage
    generateMockPayment().then((mock) => {
      setPayment(mock)
      setLoading(false)
    })
  }, [])

  async function handleCopy() {
    if (!payment) return
    await navigator.clipboard.writeText(payment.qr_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
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

        <div className="bg-card rounded-2xl p-6 flex flex-col gap-6">

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
                className="w-56 h-56"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-text">Código</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={payment.qr_code}
                className="flex-1 bg-surface border border-primary/20 rounded-full px-4 py-2 text-xs text-text/60 outline-none"
              />
              <button
                onClick={handleCopy}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors shrink-0
                  cursor-pointer 
                  ${copied
                    ? 'bg-success text-white'
                    : 'bg-primary text-white hover:bg-primary-dark'
                  }
                `}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          

          <div className="bg-warning/10 rounded-xl p-3 text-center">
            <p className="text-xs text-warning font-semibold">
              {/* irei trocar texto fixo por countdown real usando payment.expires_at quando conectar com o back */}
              ⚠️ Este QR Code expira em 30 minutos
            </p>
          </div>

          <Button variant='white' onClick={() => navigate('/checkout/shipping')}>
            Cancelar 
          </Button>
        </div>
      </div>

    </div>
  )
}