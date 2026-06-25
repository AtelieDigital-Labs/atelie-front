import type { LucideIcon } from 'lucide-react'

type MetricCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export function MetricCard({label,value,icon:Icon,iconColor,iconBg}:MetricCardProps){
  return (
    <div className='bg-card rounded-2xl p-6 flex items-start justify-between'>
      <div className='flex flex-col gap-2'>
        <span className='text-x2 font-semibold text-text/50 uppercase tracking-wide'>
          {label}
        </span>
        <span className='text-3xl font-bold text-text'>{value}</span>
      </div>

      <div className={`p-2.5 rounded-xl ${iconBg?? 'bg-surface'}`}>
        <Icon size={20} className={iconColor?? 'text-text/40'}/>
      </div>
    </div>
  )
}