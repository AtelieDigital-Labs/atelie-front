import {Routes, Route} from 'react-router-dom'
import {Dashboard} from '../pages/artisan/dashboard/index'
import {ArtisanProducts} from '../pages/artisan/products/index'
import {ArtisanOrders} from '../pages/artisan/orders/index'
import {AppLayout} from '../pages/_layouts/AppLayout'

export function ArtisianRoutes(){
  return(
    <Routes>
      <Route element={<AppLayout/>}>
          <Route path='/artisan/dashboard' element={<Dashboard/>} />
          <Route path='/artisan/products' element={<ArtisanProducts/>} />
          <Route path='/artisan/orders' element={<ArtisanOrders/>} />
      </Route>
    </Routes>
  )
}