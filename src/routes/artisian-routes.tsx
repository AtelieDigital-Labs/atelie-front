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
import {ArtisanOrderDetailPage} from '../pages/artisan/orders/detail'


export function ArtisianRoutes(){
  return(
    <Routes>
      <Route element={<AppLayout/>}>
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/products' element={<ArtisanProducts/>} />
          <Route path='/orders' element={<ArtisanOrders/>} />
          <Route path='/orders/:orderId' element={<ArtisanOrderDetailPage/>} />
          <Route path='/products/new' element={<NewProduct/>} />
          <Route path='/products/edit/:id' element={<EditProduct />} />
          <Route path='/store/new' element={<NewStore />} />
          <Route path='/store/edit' element={<EditStore />} />
          <Route path='/store/profile/:id' element={<StoreProfile />} />
          
      </Route>
    </Routes>
  )
}