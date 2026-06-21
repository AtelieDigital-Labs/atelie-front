import { BrowserRouter } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppRoutes } from './AppRoutes'
import {AuthRoutes} from './Auth-routes'

export function Router() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>Carregando...</div>

  // por enquanto só AppRoutes — client/artisan depois
  return (
    <BrowserRouter>
      <AppRoutes />  
      <AuthRoutes/>
    </BrowserRouter>
  )
}