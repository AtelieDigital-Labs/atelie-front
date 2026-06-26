import {Routes, Route} from 'react-router-dom'
import {Dashboard} from '../pages/artisan/dashboard/index'
import {AppLayout} from '../pages/_layouts/AppLayout'

export function ArtisianRoutes(){
  return(
    <Routes>
      <Route element={<AppLayout/>}>
          <Route path='/artisan/dashboard' element={<Dashboard/>} />
      </Route>
    </Routes>
  )
}