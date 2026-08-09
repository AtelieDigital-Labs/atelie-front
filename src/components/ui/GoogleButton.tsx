import iconGoogle from '../../assets/google-icon-logo-svgrepo-com.svg'
import {Button} from './Button'

export function ButtonGoogle(props: React.ButtonHTMLAttributes<HTMLButtonElement>){
  return ( 
    <Button variant='google' {...props}>
      <img src={iconGoogle} alt="" className="w-5 h-5" />
      Continuar com o google
    </Button>
  
  )
}