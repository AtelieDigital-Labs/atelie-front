import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { Input } from '../../../../components/ui/Input'
import { Button } from '../../../../components/ui/Button'
import { storeCreateSchema, type StoreCreate, type Category } from '../../../../schemas/store'

// mock — depois GET /api/v1/catalog/stores/categories
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Moda' },
  { id: 2, name: 'Casa e Decorações' },
  { id: 3, name: 'Casamento' },
  { id: 4, name: 'Festas' },
  { id: 5, name: 'Acessórios' },
]

const EMPTY_FORM: StoreCreate = {
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

type FormErrors = Partial<Record<string, string>>

export function StoreForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<StoreCreate>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: name === 'number' ? Number(value) : value,
      },
    }))
  }

  function handleImageUpload(field: 'image' | 'banner', files: FileList | null) {
    if (!files?.[0]) return
    const url = URL.createObjectURL(files[0])
    setForm(prev => ({ ...prev, [field]: url }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = storeCreateSchema.safeParse({
      ...form,
      category_id: Number(form.category_id),
    })

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

    // mock — depois POST /api/v1/catalog/stores/
    console.log('Criar loja:', result.data)
    navigate('/artisan/dashboard')
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen py-8">
      

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl w-full px-4" >

        <div className="text-center">
          <h2 className="font-title text-2xl text-primary font-bold">Criar Minha Loja</h2>
          <p className="text-sm text-text/50 mt-1">Configure sua loja e comece a vender</p>
        </div>

        {/* Informações básicas */}
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-title text-lg text-primary">Informações da Loja</h3>

          <Input
            label="Nome da Loja*"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ateliê das Flores"
            error={errors.name}
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Categoria*</label>
            <select
              name="category_id"
              value={form.category_id}
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

          <Input
            label="Chave PIX*"
            name="pix_key"
            value={form.pix_key}
            onChange={handleChange}
            placeholder="artesao@email.com"
            error={errors.pix_key}
          />
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
              <span className="text-sm text-primary/60">Clique para fazer upload da logo</span>
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
              <span className="text-sm text-primary/60">Clique para fazer upload do banner</span>
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
              value={form.address.zip_code}
              onChange={handleAddressChange}
              placeholder="59965-000"
              maxLength={9}
            />
            <Input
              label="Número*"
              name="number"
              type="number"
              value={form.address.number || ''}
              onChange={handleAddressChange}
              placeholder="442"
            />
          </div>

          <Input
            label="Rua*"
            name="street"
            value={form.address.street}
            onChange={handleAddressChange}
            placeholder="Rua das Araucarias"
          />

          <Input
            label="Complemento"
            name="complement"
            value={form.address.complement ?? ''}
            onChange={handleAddressChange}
            placeholder="Apto 101"
          />

          <Input
            label="Bairro*"
            name="neighborhood"
            value={form.address.neighborhood}
            onChange={handleAddressChange}
            placeholder="Centro"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cidade*"
              name="city"
              value={form.address.city}
              onChange={handleAddressChange}
              placeholder="Alexandria"
            />
            <Input
              label="Estado (UF)*"
              name="state"
              value={form.address.state}
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
            Criar Loja
          </Button>
        </div>

      </form>
    </div>
  )
}