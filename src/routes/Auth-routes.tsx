import { Routes,Route } from "react-router-dom";
import {SignIn} from '../pages/auth/sign-in'

export function AuthRoutes(){
  return(
    <Routes>
      <Route path="/sign-in" element={<SignIn/>}/>
    </Routes>
  )
}