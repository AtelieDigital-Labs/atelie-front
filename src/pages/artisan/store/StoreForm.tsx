import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { 
  storeCreateSchema, 
  storeUpdateSchema, 
  type StoreCreate, 
  type StoreUpdate,
  type StorePublic,
  type Category 
} from '../../../schemas/store'

type StoreFormProps = {
  mode: 'create' | 'edit'
}

// mock — depois GET /api/v1/catalog/stores/categories
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Moda' },
  { id: 2, name: 'Casa e Decorações' },
  { id: 3, name: 'Casamento' },
  { id: 4, name: 'Festas' },
  { id: 5, name: 'Acessórios' },
]

const EMPTY_CREATE_FORM: StoreCreate = {
  name: '',
  description: null,
  category_id: 0,
  image: null,
  banner: null,
  pix_key: '',
  address: {
    street: '',
    number: 0,
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    complement: null,
  },
}

// mock — depois do GET /api/v1/catalog/stores/me
const MOCK_STORE: StorePublic = {
  id: 1,
  artisan_id: 'user-123',
  name: 'Ateliê Bia',
  description: 'Laços artesanais feitos à mão com muito carinho.',
  category: { id: 1, name: 'Moda' },
  image: null,
  banner: null,
  address: {
    id: 1,
    street: 'Rua das Araucarias',
    number: 442,
    neighborhood: 'Centro',
    city: 'Alexandria',
    state: 'RN',
    zip_code: '59965-000',
    complement: null,
  },
  created_at: '2024-01-01T00:00:00',
  updated_at: '2024-01-01T00:00:00',
}

type FormErrors = Partial<Record<string, string>>

export function StoreForm({ mode }: StoreFormProps) {
  const navigate = useNavigate()

  // Estados diferentes para create e edit
  const [createForm, setCreateForm] = useState<StoreCreate>(EMPTY_CREATE_FORM)
  const [updateForm, setUpdateForm] = useState<StoreUpdate | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(mode === 'edit')

  // Carregar dados se for edição
  const loadStore = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // TODO: const response = await api.get(`/stores/me`)
      // const store = response.data

      // Mock por enquanto
      const store = MOCK_STORE

      setUpdateForm({
        description: store.description,
        image: store.image,
        banner: store.banner,
        address: store.address
          ? {
              street: store.address.street,
              number: store.address.number,
              neighborhood: store.address.neighborhood,
              city: store.address.city,
              state: store.address.state,
              zip_code: store.address.zip_code,
              complement: store.address.complement,
            }
          : undefined,
      })
    } catch (error) {
      console.error('Erro ao carregar loja:', error)
      navigate('/artisan/dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    if (mode === 'edit') {
      loadStore()
    }
  }, [mode, loadStore])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    
    if (mode === 'create') {
      setCreateForm(prev => ({ ...prev, [name]: value }))
    } else {
      setUpdateForm(prev => prev ? { ...prev, [name]: value } : null)
    }
  }

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    
    if (mode === 'create') {
      setCreateForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: name === 'number' ? Number(value) : value,
        },
      }))
    } else {
      setUpdateForm(prev => {
        const currentAddress = prev?.address || {
          street: '',
          number: 0,
          neighborhood: '',
          city: '',
          state: '',
          zip_code: '',
          complement: null,
        }
        
        return prev ? {
          ...prev,
          address: {
            ...currentAddress,
            [name]: name === 'number' ? Number(value) : value,
          },
        } : null
      })
    }
  }

  function handleImageUpload(field: 'image' | 'banner', files: FileList | null) {
    if (!files?.[0]) return
    const url = URL.createObjectURL(files[0])
    
    if (mode === 'create') {
      setCreateForm(prev => ({ ...prev, [field]: url }))
    } else {
      setUpdateForm(prev => prev ? { ...prev, [field]: url } : null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    let result
    
    if (mode === 'create') {
      result = storeCreateSchema.safeParse({
        ...createForm,
        category_id: Number(createForm.category_id),
      })
    } else {
      result = storeUpdateSchema.safeParse(updateForm)
    }

    if (!result.success) {
      const flat = result.error.flatten()
      const fieldErrors: FormErrors = {}

      Object.entries(flat.fieldErrors).forEach(([key, msgs]) => {
        if (msgs?.[0]) fieldErrors[key] = msgs[0]
      })

      if (flat.fieldErrors.address) {
        fieldErrors.address = 'Verifique os campos de endereço'
      }

      setErrors(fieldErrors)
      return
    }

    try {
      if (mode === 'create') {
        // TODO: await api.post('/stores/', result.data)
        console.log('Criar loja:', result.data)
      } else {
        // TODO: await api.patch('/stores/me', result.data)
        console.log('Atualizar loja:', result.data)
      }

      navigate('/artisan/dashboard')
    } catch (error) {
      console.error('Erro ao salvar loja:', error)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-text/60 mt-4">Carregando loja...</p>
        </div>
      </div>
    )
  }

  // Dados para renderização
  const form = mode === 'create' ? createForm : (updateForm || EMPTY_CREATE_FORM)
  const isCreate = mode === 'create'

  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl w-full px-4">
        
        <div className="text-center">
          <h2 className="font-title text-2xl text-primary font-bold">
            {isCreate ? 'Criar Minha Loja' : 'Editar Loja'}
          </h2>
          <p className="text-sm text-text/50 mt-1">
            {isCreate ? 'Configure sua loja e comece a vender' : 'Atualize as informações da sua loja'}
          </p>
        </div>

        {/* Informações básicas */}
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-title text-lg text-primary">Informações da Loja</h3>

          {/* Nome - readonly na edição */}
          <Input
            label={isCreate ? "Nome da Loja*" : "Nome da Loja"}
            name="name"
            value={isCreate ? createForm.name : MOCK_STORE.name}
            onChange={handleChange}
            placeholder="Ateliê das Flores"
            error={errors.name}
            disabled={!isCreate}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Descrição</label>
            <textarea
              name="description"
              value={form.description ?? ''}
              onChange={handleChange}
              placeholder="Conte um pouco sobre sua loja..."
              rows={3}
              className={`
                w-full rounded-2xl border border-primary/20 bg-surface
                px-4 py-3 text-sm text-text placeholder:text-text/40
                outline-none transition-colors resize-none
                focus:border-primary focus:ring-2 focus:ring-primary/20
                ${errors.description ? 'border-danger' : ''}
              `}
            />
            {errors.description && (
              <p className="text-xs text-danger">{errors.description}</p>
            )}
          </div>

          {/* Categoria - readonly na edição */}
          {isCreate ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Categoria*</label>
              <select
                name="category_id"
                value={createForm.category_id}
                onChange={handleChange}
                className={`
                  h-10 w-full rounded-full border border-primary/20 bg-surface
                  px-4 text-sm text-text outline-none transition-colors
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  ${errors.category_id ? 'border-danger' : ''}
                `}
              >
                <option value={0} disabled>Selecione uma categoria</option>
                {MOCK_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-danger">{errors.category_id}</p>
              )}
            </div>
          ) : (
            <Input
              label="Categoria"
              value={MOCK_STORE.category.name}
              disabled
            />
          )}

          {isCreate && (
            <Input
              label="Chave PIX*"
              name="pix_key"
              value={createForm.pix_key}
              onChange={handleChange}
              placeholder="artesao@email.com"
              error={errors.pix_key}
            />
          )}
        </div>

        {/* Imagens */}
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-title text-lg text-primary">Imagens</h3>

          {/* Logo */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-text">Logo da Loja</p>
            {form.image && (
              <img
                src={form.image}
                alt="Logo"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
              />
            )}
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/20 rounded-2xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
              <Upload size={20} className="text-primary/40" />
              <span className="text-sm text-primary/60">
                {isCreate ? 'Clique para fazer upload da logo' : 'Clique para atualizar a logo'}
              </span>
              <span className="text-xs text-text/40">JPG, PNG, WEBP (máx. 5MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => handleImageUpload('image', e.target.files)}
              />
            </label>
          </div>

          {/* Banner */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-text">Banner da Loja</p>
            {form.banner && (
              <img
                src={form.banner}
                alt="Banner"
                className="w-full h-32 rounded-2xl object-cover border-2 border-primary/20"
              />
            )}
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/20 rounded-2xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
              <Upload size={20} className="text-primary/40" />
              <span className="text-sm text-primary/60">
                {isCreate ? 'Clique para fazer upload do banner' : 'Clique para atualizar o banner'}
              </span>
              <span className="text-xs text-text/40">JPG, PNG, WEBP (máx. 5MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => handleImageUpload('banner', e.target.files)}
              />
            </label>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-title text-lg text-primary">Endereço</h3>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CEP*"
              name="zip_code"
              value={form.address?.zip_code ?? ''}
              onChange={handleAddressChange}
              placeholder="59965-000"
              maxLength={9}
            />
            <Input
              label="Número*"
              name="number"
              type="number"
              value={form.address?.number || ''}
              onChange={handleAddressChange}
              placeholder="442"
            />
          </div>

          <Input
            label="Rua*"
            name="street"
            value={form.address?.street ?? ''}
            onChange={handleAddressChange}
            placeholder="Rua das Araucarias"
          />

          <Input
            label="Complemento"
            name="complement"
            value={form.address?.complement ?? ''}
            onChange={handleAddressChange}
            placeholder="Apto 101"
          />

          <Input
            label="Bairro*"
            name="neighborhood"
            value={form.address?.neighborhood ?? ''}
            onChange={handleAddressChange}
            placeholder="Centro"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cidade*"
              name="city"
              value={form.address?.city ?? ''}
              onChange={handleAddressChange}
              placeholder="Alexandria"
            />
            <Input
              label="Estado (UF)*"
              name="state"
              value={form.address?.state ?? ''}
              onChange={handleAddressChange}
              placeholder="RN"
              maxLength={2}
            />
          </div>

          {errors.address && (
            <p className="text-xs text-danger">{errors.address}</p>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="danger"
            onClick={() => navigate('/artisan/dashboard')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant='success'>
            {isCreate ? 'Criar Loja' : 'Salvar Alterações'}
          </Button>
        </div>

      </form>
    </div>
  )
}