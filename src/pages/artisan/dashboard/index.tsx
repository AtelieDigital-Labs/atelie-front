import { Package, AlertTriangle, Truck, DollarSign } from 'lucide-react'
import {MetricCard} from './components/MetricCard'
import {SalesChart} from './components/SalesChart'

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
  return (

    <div className='flex flex-col gap-6'>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'> 
        {
          METRICS.map(metric => (
            <MetricCard key={metric.label} {...metric}/>
            
          ))
        }
      </div>

      <div>
        <SalesChart/>
      </div>

    </div>
  )
}