import {Routes, Route} from 'react-router-dom'
import {AppLayout} from '../pages/_layouts/AppLayout'
import {Home} from '../pages/app/home'

export function AppRoutes(){
  return(
    <Routes>
      <Route element={<AppLayout/>}>
      <Route path='/' element={<Home/>}/>
      </Route>
    </Routes>
  )
}