import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Table } from '../../../components/ui/Table'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import type { Address, AddressCreate } from '../../../schemas/user'
import {formatCEP, unformatCEP} from '../../../utils/formatters'

const EMPTY_ADDRESS: AddressCreate = {
  street: '',
  number: 0,
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip_code: '',
  is_main: false,
}

const COLUMNS = [
  {
    key: 'address',
    label: 'Endereço',
    render: (row: Address) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.street}, {row.number}</span>
        {row.is_main && (
          <span className="text-xs text-success border border-success/30 rounded-full px-2 py-0.5">
            Padrão
          </span>
        )}
      </div>
    ),
  },
  {
    key: 'neighborhood',
    label: 'Comp. / Bairro',
    render: (row: Address) => (
      <div>
        <p className="text-xs text-text/50">{row.complement ?? '-'}</p>
        <p>{row.neighborhood}</p>
      </div>
    ),
  },
  {
    key: 'city',
    label: 'Cidade/UF',
    render: (row: Address) => <span>{row.city} / {row.state}</span>,
  },
  {
    key: 'zip_code',
    label: 'CEP',
    render: (row: Address) => <span>{formatCEP(row.zip_code)}</span>,
  },
  {
    key: 'actions',
    label: 'Ações',
    render: (_row: Address) => (
      <div className="flex items-center gap-3">
        <button aria-label="Editar" className="text-warning hover:text-warning/70 transition-colors">
          <Pencil size={16} />
        </button>
        <button aria-label="Excluir" className="text-danger hover:text-danger-dark transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
]

type AddressTabProps = {
  initialAddresses: Address[]
}

export function AddressTab({ initialAddresses }: AddressTabProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState<AddressCreate>(EMPTY_ADDRESS)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    
    const {name, value} = e.target

    let formattedValue = value
    if (name === 'zip_code') {
      formattedValue = formatCEP(value)
    }
    
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.name === 'number'
        ? Number(e.target.value)
        : formattedValue,
    }))
  }


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // mock — POST /api/v1/accounts/addresses/
    const payload = {
      ...form,
      zip_code: unformatCEP(form.zip_code),
    }


    const newAddress: Address = { ...payload, id: Date.now() }
    setAddresses(prev => [...prev, newAddress])
    setShowForm(false)
    setForm(EMPTY_ADDRESS)
  }

  return (
    <div className="flex flex-col gap-4">
      <Table
        columns={COLUMNS}
        data={addresses}
        emptyMessage="Nenhum endereço cadastrado"
      />

      {showForm ? (
        <div className="bg-card rounded-2xl p-6">
          <h3 className="font-title text-lg text-primary mb-4">Novo Endereço</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="CEP"
                name="zip_code"
                value={form.zip_code}
                onChange={handleChange}
                placeholder="59965-000"
                maxLength={9}
                required
              />
              <Input
                label="Número"
                name="number"
                type="number"
                value={form.number || ''}
                onChange={handleChange}
                placeholder="442"
                required
              />
            </div>

            <Input
              label="Rua"
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="Rua das Araucarias"
              required
            />

            <Input
              label="Complemento"
              name="complement"
              value={form.complement ?? ''}
              onChange={handleChange}
              placeholder="Apto 101"
            />

            <Input
              label="Bairro"
              name="neighborhood"
              value={form.neighborhood}
              onChange={handleChange}
              placeholder="Centro"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Cidade"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Alexandria"
                required
              />
              <Input
                label="Estado (UF)"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="RN"
                maxLength={2}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_main"
                type="checkbox"
                checked={form.is_main}
                onChange={e => setForm(prev => ({ ...prev, is_main: e.target.checked }))}
                className="accent-primary"
              />
              <label htmlFor="is_main" className="text-sm text-text/70">
                Definir como endereço padrão
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => { setShowForm(false); setForm(EMPTY_ADDRESS) }}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                Salvar endereço
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className='flex justify-end'>
        <Button variant="success" size="sm" onClick={() => setShowForm(true)}>
          Adicionar novo endereço
        </Button>
        </div>
      )}
    </div>
  )
}