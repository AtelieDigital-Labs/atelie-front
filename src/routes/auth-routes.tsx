import { Routes,Route } from "react-router-dom";
import {SignIn} from '../pages/auth/sign-in'
import {SignUp} from '../pages/auth/sign-up'

export function AuthRoutes(){
  return(
    <Routes>
      <Route path="/sign-in" element={<SignIn/>}/>
      <Route path="/sign-up" element={<SignUp/>}/>
    </Routes>
  )
}