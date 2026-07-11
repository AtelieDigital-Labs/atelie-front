import { Link, useLocation } from 'react-router-dom'

const TABS = [
  { label: 'Dashboard', path: '/artisan/dashboard' },
  { label: 'Sua Loja',  path: '/artisan/store/profile' },
  { label: 'Produtos',  path: '/artisan/products' },
  { label: 'Pedidos',   path: '/artisan/orders' },
]

export function DashboardTabs() {
  const { pathname } = useLocation()

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {TABS.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`
            px-5 py-2 rounded-full text-sm font-medium transition-colors border
            ${pathname === tab.path
              ? 'border-primary text-primary'
              : 'border-transparent text-text/60 hover:text-primary hover:border-primary/30'
            }
          `}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}