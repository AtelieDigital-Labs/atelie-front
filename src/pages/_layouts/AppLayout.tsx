import { Outlet} from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'


export function AppLayout(){
  return(
    <div className='min-h-screen flex flex-col bg-surface'>
      <Header username='Valdivania'/>

      <main className='flex-1 container-app py-8'>
        <Outlet/>
      </main>

      <Footer/>
    </div>
  )
}