import {Heart} from 'lucide-react'
import {useState} from 'react'


type FavoriteButtonProps ={
  initialFavorite?: boolean
  onChange?: (favorited: boolean) => void
}


export function FavoriteButton({initialFavorite = false, onChange}: FavoriteButtonProps) {

  const [favorited, setFavorited] = useState(initialFavorite)

  function handleToggle() {
    const next = !favorited
    setFavorited(next)
    onChange?.(next)
  }

  
  return(
    <button
      arial-label= {favorited ? 'Remove from favorites' : 'Add to favorites'}
      onClick={handleToggle}
      className='bg-background rounded-full p-1.5 transition-colors hover:scale-110 cursor-pointer'
    >
      
    <Heart
      size={16}
      className={favorited ? 'text-primary fill-primary' : 'text-primary'}
    />  
    
    </button>
  )
}