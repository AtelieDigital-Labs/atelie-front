import { Package, AlertTriangle, Truck, DollarSign } from 'lucide-react'
import {MetricCard} from './components/MetricCard'
import {SalesChart} from './components/SalesChart'
import {RecentProducts} from './components/RecentProducts'
import {Link, useLocation} from 'react-router-dom'

const TABS = [
  { label: 'Dashboard', to: '/artisan/dashboard' },
  { label: 'Sua Loja',  to: '/artisan/store' },
  { label: 'Produtos',  to: '/artisan/products' },
  { label: 'Pedidos',   to: '/artisan/orders' },
]

const METRICS = [
  {
    label: 'Produtos Ativos',
    value: 5,
    icon: Package,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
  {
    label: 'Pouco Estoque',
    value: 1,
    icon: AlertTriangle,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
  {
    label: 'Pedidos em Andamento',
    value: 0,
    icon: Truck,
    iconBg: 'bg-highlight/10',
    iconColor: 'text-highlight',
  },
  {
    label: 'Total em Vendas',
    value: 'R$ 150,00',
    icon: DollarSign,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
]

export function Dashboard(){
   const { pathname } = useLocation()
  return (
    
    <div className='flex flex-col gap-6'>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        {TABS.map(tab => (
          <Link
            key={tab.to}
            to={tab.to}
            className={`
              px-5 py-2 rounded-full text-sm font-medium transition-colors border
              ${pathname === tab.to
                ? 'border-primary text-primary'
                : 'border-transparent text-text/60 hover:text-primary hover:border-primary/30'
              }
            `}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'> 
        {
          METRICS.map(metric => (
            <MetricCard key={metric.label} {...metric}/>
            
          ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <SalesChart/>
        <RecentProducts/>
      </div>

    </div>
  )
}