import { BrowserRouter } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppRoutes } from './AppRoutes'

export function Routes() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>Carregando...</div>

  // por enquanto só AppRoutes — client/artisan depois
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}