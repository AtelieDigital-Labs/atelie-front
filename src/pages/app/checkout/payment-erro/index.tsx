import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'

export function PaymentErrorPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

 
  const message = state?.message ?? 'Pedido criado! Porém, ocorreu um erro ao gerar o pagamento. Acesse Meus Pedidos para tentar pagar novamente.'

  return (
    <div className="max-w-md mx-auto bg-card rounded-2xl p-6 flex flex-col items-center gap-3 text-center mt-32 ">
      <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center">
        <AlertTriangle className="text-warning" size={28} />
      </div>
      <h2 className="text-lg font-bold text-text">Não foi possível gerar o pagamento</h2>
      <p className="text-sm text-text/60">{message}</p>
      <Button fullWidth onClick={() => navigate('/orders/list')} className="cursor-pointer">
       Meus Pedidos
      </Button>
    </div>
  )
}