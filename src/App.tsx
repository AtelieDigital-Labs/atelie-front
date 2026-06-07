
import { Header } from "./components/Header"
import {FavoriteButton} from './components/ui/FavoriteButton'
import {Stars} from './components/ui/Stars'

function App() {

  return (
   <div>
     <Header/>
     <FavoriteButton />
    <Stars rating={4} maxStars={5} reviewCount={100} />
   </div>
    
 
   
  )
}

export default App
