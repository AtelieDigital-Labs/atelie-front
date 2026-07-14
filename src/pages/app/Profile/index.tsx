import {useState} from 'react'
import {PersonalData} from './PersonalData'
import {AddressTab} from './AddressTab'
import { useAuth } from '../../../hooks/useAuth'
import { useListAddresses } from '../../../hooks/accounts/useAddresses'
import { BecomeArtisan } from './BecomeArtisan'

type Tab ='personal' | 'address'

type TabArtisan ='personal' | 'address' | 'artisan'

const TABSArtisan: { key: TabArtisan; label: string; path: string }[] = [
  { key: 'personal', label: 'Dados Pessoais', path: '/profile' },
  { key: 'address', label: 'Endereço', path: '/profile/address' },
  { key: 'artisan', label: 'Mudar para vendedor', path: '/profile/change-artisan' },
]

const TABS: { key: Tab; label: string; path: string }[] = [
  { key: 'personal', label: 'Dados Pessoais', path: '/profile' },
  { key: 'address', label: 'Endereço', path: '/profile/address' },
]

export function Profile() {
  const [activeTab, setActiveTab] = useState<Tab | TabArtisan>('personal')
  const { user } = useAuth()
  const {data, isPending, error } = useListAddresses()
  let tabs;
  if (user?.is_artisan) {
    tabs = TABS
  } else {
    tabs = TABSArtisan
  }
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-title text-2xl text-primary">Configurações do Perfil</h2>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map(tab => (
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
      {!user?.is_artisan && activeTab === 'artisan' && (
        <BecomeArtisan />
      )}
    </div>
  )
}