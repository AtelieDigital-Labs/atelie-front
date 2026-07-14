import { ShoppingCart, Heart, Store, User, ChevronDown, Menu, UserCircle, Package, LogOut } from 'lucide-react'
import { Search } from './ui/Search'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState, useRef, useEffect } from 'react'
import { useLogout } from '../hooks/accounts/useAuth'

type HeaderProps = {
  username?: string
}

const NAV_ICONS = [
  { icon: ShoppingCart, label: 'Carrinho', to: '/cart' },
  { icon: Heart, label: 'Favoritos', to: '/favorite' },
]

const CATEGORIES = [
  { label: 'Moda', value: 'moda' },
  { label: 'Casa e decorações', value: 'casa-e-decoracoes' },
  { label: 'Casamento', value: 'casamento' },
  { label: 'Festas', value: 'festas' },
  { label: 'Acessórios', value: 'acessorios' },
]




export function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [query, setQuery] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const logoutMutation = useLogout()

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  function handleLogout() {
    logoutMutation.mutate(null, {
      onSuccess: () => {
        // Só executa após o token sumir e o cache ser resetado
        navigate("/");
        setIsProfileOpen(false);
      }
    });
  }

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

            {user?.is_artisan && (
              <Link
                aria-label='Lojas'
                to="/artisan/dashboard"
                className="hover:text-primary-dark transition-colors"
              >
                <Store size={22} />
              </Link>
            )}

            <div className="relative" ref={profileRef}>
              {isAuthenticated && user ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="Perfil"
                  className="flex items-center gap-1.5 hover:text-primary-dark transition-colors cursor-pointer"
                >
                  <User size={22} />

                  <span className="hidden sm:inline text-sm">{user.username}</span>

                  <ChevronDown className="hidden sm:block" size={15} />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 hover:text-primary-dark transition-colors cursor-pointer">
                  <User size={22} />
                  <Link to="/auth/sign-in" className="hidden sm:inline text-sm">
                    Sign-in
                  </Link>
                </div>
                )}

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-text hover:bg-primary/5 transition-colors"
                      >
                        <UserCircle size={18} className='text-primary' />
                        <span className='text-primary' >Meu Perfil</span>
                      </Link>

                      <Link
                        to="/orders/list"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-text hover:bg-primary/5 transition-colors "
                      >
                        <Package size={18} className='text-primary' />
                        <span className='text-primary'>Meus Pedidos</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-danger hover:bg-red-50 transition-colors border-t border-border cursor-pointer rounded-b-lg"
                      >
                        <LogOut size={18} className='text-primary' />
                        <span className='text-primary'>Sair</span>
                      </button>
                    </div>
                  )}
                </div>
          </div>


            <form onSubmit={handleSearch} className="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
              <Search
                value={query}
                onChange={e => setQuery(e.target.value)}

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