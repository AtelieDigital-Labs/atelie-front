import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { useNavigate } from 'react-router-dom'

export function BecomeArtisan() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  async function handleBecomeArtisan() {
    setIsLoading(true)
    
    try {
      // chamar API para mudar tipo de usuário
      // const { data } = await api.patch('/accounts/become-artisan')
      
      navigate('/artisan/store/new')
    } catch (error) {
      console.error('Erro ao mudar para vendedor:', error)
      alert('Erro ao atualizar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-2xl p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-title text-xl text-primary mb-2 font-bold">
            Você também cria produtos artesanais?
          </h3>
          <p className="text-text/70 mb-1">
            Mude sua conta para o tipo <strong>Vendedor</strong>!
          </p>
          <p className="text-sm text-text/50">
            A conta de vendedor permite comprar e vender no Ateliê Digital.
          </p>
        </div>

        <div className="bg-surface rounded-xl p-4 mt-2">
          <h4 className="font-semibold text-text mb-3">Benefícios de ser vendedor:</h4>
          <ul className="space-y-2 text-sm text-text/70">
            <li className="flex items-start gap-2">
              <span className="text-success font-bold">✓</span>
              <span>Crie e gerencie sua própria loja</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success font-bold">✓</span>
              <span>Publique produtos artesanais</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success font-bold">✓</span>
              <span>Acompanhe pedidos e vendas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success font-bold">✓</span>
              <span>Continue comprando normalmente</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleBecomeArtisan}
            disabled={isLoading}
            className="bg-success hover:bg-success-dark text-white"
          >
            {isLoading ? 'Processando...' : 'Ser um vendedor'}
          </Button>
        </div>
      </div>
    </div>
  )
}