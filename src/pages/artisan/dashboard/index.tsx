import { useState, useEffect } from 'react'
import { Package, Truck, DollarSign } from 'lucide-react'
import { MetricCard } from './components/MetricCard'
import { SalesChart } from './components/SalesChart'
import { RecentProducts } from './components/RecentProducts'
import { DashboardTabs } from '../components/DashboardTabs'

export function Dashboard() {
  // Estado para o saldo, inicializado com o valor mockado
  const [walletBalance, setWalletBalance] = useState('R$ 150,00')


  useEffect(() => {
    async function fetchWalletData() {
      try {
        // Quando a rota estiver pronta
        // const { data } = await api.get('.../users/me/wallet')
        // const formattedBalance = `R$ ${Number(data.balance).toFixed(2).replace('.', ',')}`
        // setWalletBalance(formattedBalance)

        // MOCK
        await new Promise(resolve => setTimeout(resolve, 500))
        setWalletBalance('R$ 150,00')
        
      } catch (error) {
        console.error('Erro ao buscar saldo da carteira:', error)
        // Opcional: definir como 'R$ 0,00' ou manter o último valor conhecido em caso de erro
      }
    }

    fetchWalletData()
  }, [])

  // Métricas com estado reativo
  const METRICS = [
    {
      label: 'Produtos Ativos',
      value: 5,
      icon: Package,
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      label: 'Pedidos em Andamento',
      value: 0,
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