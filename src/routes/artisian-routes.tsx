import {Routes, Route} from 'react-router-dom'
import {Dashboard} from '../pages/artisan/dashboard/index'
export function ArtisianRoutes(){
  return(
    <Routes>
      <Route path='/artisan/dashboard' element={<Dashboard/>} />
    </Routes>
  )
}