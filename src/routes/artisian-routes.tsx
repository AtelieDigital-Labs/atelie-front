import {Routes, Route} from 'react-router-dom'
import {Dashboard} from '../pages/artisan/dashboard/index'
import {ArtisanProducts} from '../pages/artisan/products/index'
import {ArtisanOrders} from '../pages/artisan/orders/index'
import {AppLayout} from '../pages/_layouts/AppLayout'
import { NewProduct } from '../pages/artisan/products/new'
import { EditProduct } from '../pages/artisan/products/edit'
import {NewStore} from '../pages/artisan/store/new/index'
import {EditStore} from '../pages/artisan/store/edit/index'
import {StoreProfile} from '../pages/artisan/store/profile/index'

export function ArtisianRoutes(){
  return(
    <Routes>
      <Route element={<AppLayout/>}>
          <Route path='/artisan/dashboard' element={<Dashboard/>} />
          <Route path='/artisan/products' element={<ArtisanProducts/>} />
          <Route path='/artisan/orders' element={<ArtisanOrders/>} />
          <Route path='/artisan/products/new' element={<NewProduct/>} />
          <Route path='/artisan/products/edit/:id' element={<EditProduct />} />
          <Route path='/artisan/store/new' element={<NewStore />} />
          <Route path='/artisan/store/edit' element={<EditStore />} />
          <Route path="/artisan/store/profile" element={<StoreProfile />} />
          <Route path='/artisan/store/profile/:id' element={<StoreProfile />} />

      </Route>
    </Routes>
  )
}