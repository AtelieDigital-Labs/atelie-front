import {useState} from 'react'
import {PersonalData} from './PersonalData'
import {AddressTab} from './AdressTab'
import { useAuth } from '../../../hooks/useAuth'
import { useListAddresses } from '../../../hooks/accounts/useAddresses'

type Tab ='personal' | 'address'


const TABS: { key: Tab; label: string }[] = [
  { key: 'personal', label: 'Dados Pessoais' },
  { key: 'address',  label: 'Endereço' },
]

export function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>('personal')
  const { user } = useAuth()
  const {data, isPending, error } = useListAddresses()
  
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-title text-2xl text-primary">Configurações do Perfil</h2>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-5 py-2 rounded-full text-sm font-medium transition-colors border
              ${activeTab === tab.key
                ? 'bg-warning text-white border-warning'
                : 'border-primary/20 text-text/60 hover:border-primary/40 hover:text-primary'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

        {activeTab === 'personal' && user &&(
          <PersonalData user={user} />
        )}

      {activeTab === 'address' && data && (
        <AddressTab initialAddresses={data} />
      )}
    </div>
  )
}