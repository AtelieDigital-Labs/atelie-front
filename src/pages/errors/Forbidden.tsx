
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex flex-col items-center gap-2 justify-center bg-surface px-4">
      <h1 className="text-6xl font-bold text-primary mb-4 font-body">403</h1>
      <h2 className="text-xl font-semibold text-text mb-2 font-body">Acesso Restrito</h2>
      <p className="text-sm text-text/50 mb-6 text-center font-body">
        Você não tem permissão para entrar neste ateliê!
      </p>
      <Button onClick={() => navigate('/')} variant="outline" className='font-body'>
        Voltar para a página inicial
      </Button>
    </div>
  )
}

