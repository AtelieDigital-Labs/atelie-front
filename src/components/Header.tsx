import { ShoppingCart, Heart, Store, User, ChevronDown, Menu } from 'lucide-react'
import { Search } from './ui/Search'
import {useNavigate, Link} from 'react-router-dom'
import { useState } from 'react'

type HeaderProps = {
  username?: string
}

const NAV_ICONS = [
  { icon: ShoppingCart, label: 'Carrinho', to: '/ShoppingCart' },
  { icon: Heart,        label: 'Favoritos', to: 'client/favorite' },
  { icon: Store,        label: 'Lojas', to: '/artisan/dashboard' },
]

const CATEGORIES = [
    { label: 'Moda', value: 'moda' },
    { label: 'Casa e decorações', value: 'casa-e-decoracoes' },
    { label: 'Casamento', value: 'casamento' },
    { label: 'Festas', value: 'festas' },
    { label: 'Acessórios', value: 'acessorios' },
]




export function Header({ username = 'Usuário' }: HeaderProps) {
  const navigate = useNavigate()
  const [query, setQuery]= useState('')

  function handleSearch(e:  React.SubmitEvent<HTMLFormElement>){
    e.preventDefault()
    if(query.trim()){
      navigate(`search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="bg-card border-b-2 border-primary/20 ">
      <div className="container-app mx-auto px-4 lg:px-8">

        <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] items-center gap-4 py-3">

          {/* Coluna 1  */}
         <Link to={'/'}>
          <h1 className="font-title text-2xl font-bold text-primary whitespace-nowrap">
            Ateliê Digital
          </h1>
         </Link>

          {/* Col 2 mobile / Col 3 desktop — Ações */}
          <div className="flex items-center justify-end gap-4 text-primary">
            {NAV_ICONS.map(({ icon: Icon, label, to }) => (
              <Link
                key={label}
                aria-label={label}
                to={to}
                className="hover:text-primary-dark transition-colors"
              >
                <Icon size={22} />
              </Link>
            ))}

            <button
              aria-label="Perfil"
              className="flex items-center gap-1.5 hover:text-primary-dark transition-colors"
            >
              <User size={22} />
              <span className="hidden sm:inline text-sm">{username}</span>
              <ChevronDown className="hidden sm:block" size={15} />
            </button>
          </div>

          
          <form onSubmit={handleSearch} className="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <Search 
              value={query}
              onChange={e=>setQuery(e.target.value)}
            
            />

          </form>
        

        </div>

      

      </div>

        {/* Navbar de categorias */}
      <nav className="bg-primary  ">
        <div className="container-app">
          <ul className="flex items-center justify-between overflow-x-auto scrollbar-hide py-2.5 ">

            <li className="shrink-0">
              <button className="flex items-center gap-2 text-white/90 hover:text-white text-sm px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors">
                <Menu size={16} />
                <span>Categorias</span>
              </button>
            </li>

            

            {CATEGORIES.map(cat => (
              <li key={cat.value} className="shrink-0">
                <button
                  onClick={() => navigate(`/search?category=${cat.value}`)}
                  className="text-white/90 hover:text-white text-sm px-4 py-1.5 rounded-md hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {cat.label}
                </button>
              </li>
            ))}

          </ul>
        </div>
      </nav>


    </header>
  )
}