import { Route, Routes } from 'react-router-dom'
import {Favorites} from '../pages/client/favorites'
import {AppLayout} from '../pages/_layouts/AppLayout'

export function ClientRoutes(){
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/client/favorite" element={<Favorites />} /> 
      </Route>
    </Routes>
  )
}