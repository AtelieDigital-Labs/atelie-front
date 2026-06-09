import { ShoppingCart, Heart, Store, User, ChevronDown, Menu } from 'lucide-react'
import { Search } from './ui/Search'

type HeaderProps = {
  username?: string
}

const NAV_ICONS = [
  { icon: ShoppingCart, label: 'Carrinho' },
  { icon: Heart,        label: 'Favoritos' },
  { icon: Store,        label: 'Lojas' },
]

const CATEGORIES = [
  'Moda',
  'Casa e decorações',
  'Casamento',
  'Festas',
  'Acessórios',
]


export function Header({ username = 'Usuário' }: HeaderProps) {
  return (
    <header className="bg-card border-b-2 border-primary/20 ">
      <div className="container-app mx-auto px-4 lg:px-8">

        <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] items-center gap-4 py-3">

          {/* Coluna 1  */}
          <h1 className="font-title text-2xl font-bold text-primary whitespace-nowrap">
            Ateliê Digital
          </h1>

          {/* Col 2 mobile / Col 3 desktop — Ações */}
          <div className="flex items-center justify-end gap-4 text-primary">
            {NAV_ICONS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="hover:text-primary-dark transition-colors"
              >
                <Icon size={22} />
              </button>
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

          <div className="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <Search />
          </div>

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

            

            {CATEGORIES.map(category => (
              <li key={category} className="shrink-0">
                <button className="text-white/90 hover:text-white text-sm px-4 py-1.5 rounded-md hover:bg-white/10 transition-colors whitespace-nowrap">
                  {category}
                </button>
              </li>
            ))}

          </ul>
        </div>
      </nav>


    </header>
  )
}