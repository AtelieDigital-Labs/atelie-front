import {Routes, Route} from 'react-router-dom'
import {AppLayout} from '../pages/_layouts/AppLayout'
import {Home} from '../pages/app/home'
import {ProductDetail} from '../pages/app/product-detail/index'
import { SearchPage } from '../pages/app/search'
import { Profile } from '../pages/app/Profile'
import { Favorites } from '../pages/app/favorites'
import { CartPage } from '../pages/app/cart'
import { ShippingPage } from '../pages/app/checkout/shipping'
import { PaymentPage } from '../pages/app/checkout/payment'
import { PaymentErrorPage } from '../pages/app/checkout/payment-erro'
import {PaymentApprovedPage} from '../pages/app/checkout/PaymentApproved'
import {OrderDetailPage} from '../pages/app/order/detail'
import {OrdersListPage} from '../pages/app/order/list'


export function AppRoutes(){
  return(
    <Routes>
      <Route element={<AppLayout/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='product/:id' element={<ProductDetail/>}/>
        <Route path="/favorite" element={<Favorites />} /> 
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/shipping" element={<ShippingPage />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />
        <Route path="/checkout/payment-error" element={<PaymentErrorPage />} />
        <Route path="/checkout/success/:checkoutGroupId" element={<PaymentApprovedPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/orders/list" element={<OrdersListPage/>}/>

      </Route>
    </Routes>
  )
}