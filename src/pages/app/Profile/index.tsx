import {useState} from 'react'
import type {User, Address} from '../../../schemas/user'
import {PersonalData} from './PersonalData'
import {AddressTab} from './AdressTab'

type Tab ='personal' | 'address'


const TABS: { key: Tab; label: string }[] = [
  { key: 'personal', label: 'Dados Pessoais' },
  { key: 'address',  label: 'Endereço' },
]

const MOCK_USER: User = {
  id: 1,
  username: 'valdivania',
  first_name: 'Valdivania',
  last_name: 'Silva',
  email: 'valdivania@gmail.com',
  bio: null,
  cpf: '83456509022',
  phone_number: '(84) 99999-9999',
  date_of_birth: '2000-10-21',
  profile_image: null,
  is_artisan: false,
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    street: 'Rua das Araucarias',
    number: 442,
    complement: null,
    neighborhood: 'Centro',
    city: 'Alexandria',
    state: 'RN',
    zip_code: '59965000',
    is_main: true,
  },
]


export function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>('personal')

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

      {activeTab === 'personal' && (
        <PersonalData user={MOCK_USER} />
      )}

      {activeTab === 'address' && (
        <AddressTab initialAddresses={MOCK_ADDRESSES} />
      )}
    </div>
  )
}