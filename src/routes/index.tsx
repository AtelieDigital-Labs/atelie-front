import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppRoutes } from './app-routes'
import {AuthRoutes} from './auth-routes'
import {ArtisianRoutes} from './artisian-routes'



export function Router() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>Carregando...</div>

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/artisan/*" element={<ArtisianRoutes />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}