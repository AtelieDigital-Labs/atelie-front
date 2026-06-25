import { BrowserRouter } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppRoutes } from './app-routes'
import {AuthRoutes} from './auth-routes'
import {ArtisianRoutes} from './artisian-routes'

export function Router() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>Carregando...</div>

  // por enquanto só AppRoutes — client/artisan depois
  return (
    <BrowserRouter>
      <AppRoutes />  
      <AuthRoutes/>
      <ArtisianRoutes/>
      
    </BrowserRouter>
  )
}