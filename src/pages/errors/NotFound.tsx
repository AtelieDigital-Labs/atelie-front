
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex flex-col items-center gap-2 justify-center bg-surface px-4">
      <h1 className="text-6xl text-primary mb-4 font-bold font-body">404</h1>
      <h2 className="text-xl font-semibold text-text mb-2 font-body">Oops! Página não encontrada</h2>
      <p className="text-sm text-text/50 mb-6 text-center font-body">
        A página que você está procurando não existe ou foi movida!
      </p>
      <Button onClick={() => navigate('/')} variant="outline" className='font-body'>
        Voltar para a página inicial
      </Button>
    </div>
  )
}