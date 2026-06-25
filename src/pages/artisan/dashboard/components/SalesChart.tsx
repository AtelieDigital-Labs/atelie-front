import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {ChevronDown} from 'lucide-react'


const MOCK_DATA = [
  { semana: 'Semana 1', vendas: 12, avaliacoes: 40 },
  { semana: 'Semana 2', vendas: 13, avaliacoes: 40 },
  { semana: 'Semana 3', vendas: 16, avaliacoes: 50 },
  { semana: 'Semana 4', vendas: 17, avaliacoes: 40 },
]


export function SalesChart(){
  return (
    <div className='bg-card rounded-2xl p-6 flex flex-col gap-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='font-title font-bold text-xl  text-primary '>Gráfico de vendas mensais</h3>
          <p className='text-xs text-text/50 mt-0.5'>Acompanhe o desempenho da sua loja</p>
        </div>
        <button className='flex items-center gap-1.5 text-sm text-text/60 border border-primary/20 rounded-xl px-3 py-1.5 hover:border-primary transition-colors'>
          Outubro 2026
          <ChevronDown size={14}/>
        </button>

      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={MOCK_DATA} barGap={8}>
          <XAxis
            dataKey="semana"
            tick={{ fontSize: 12, fill: '#36363680' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: '#F7F1EB',
              border: 'none',
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 13, paddingTop: 16 }}
          />
          <Bar dataKey="avaliacoes" name="Avaliações" fill="#9E502B" radius={[6, 6, 0, 0]} />
          <Bar dataKey="vendas" name="Vendas" fill="#4A7A9F" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

    </div>
  )
}