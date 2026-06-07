import { ShoppingCart, Heart, Store, User, ChevronDown } from 'lucide-react'
import { Search } from './ui/Search'

type HeaderProps = {
  username?: string
}

const NAV_ICONS = [
  { icon: ShoppingCart, label: 'Carrinho' },
  { icon: Heart,        label: 'Favoritos' },
  { icon: Store,        label: 'Lojas' },
]

export function Header({ username = 'Usuário' }: HeaderProps) {
  return (
    <header className="bg-card border-b-2 border-primary/20">
      <div className="mx-auto px-4 lg:px-8">

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
    </header>
  )
}