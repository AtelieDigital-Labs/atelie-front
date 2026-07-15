import { Package, Truck, DollarSign } from 'lucide-react'
import { MetricCard } from './components/MetricCard'
import { SalesChart } from './components/SalesChart'
import { RecentProducts } from './components/RecentProducts'
import { DashboardTabs } from '../components/DashboardTabs'
import { useMyWallet } from '../../../hooks/accounts/useWallet'

export function Dashboard() {
  const { data: wallet, isPending: isWalletPending } = useMyWallet()

  const walletBalance = isWalletPending || !wallet
    ? 'Carregando...'
    : `R$ ${wallet.balance.toFixed(2).replace('.', ',')}`

  const METRICS = [
    {
      label: 'Produtos Ativos',
      value: 8,
      icon: Package,
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      label: 'Pedidos em Andamento',
      value: 3,
      icon: Truck,
      iconBg: 'bg-highlight/10',
      iconColor: 'text-highlight',
    },
    {
      label: 'Saldo na carteira',
      value: walletBalance,
      icon: DollarSign,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
  ]

  return (
    <div className='flex flex-col gap-6'>
      <DashboardTabs />

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {METRICS.map(metric => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <SalesChart />
        <RecentProducts />
      </div>
    </div>
  )
}