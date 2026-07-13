import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import {
  storeCreateSchema,
  storeUpdateSchema,
  type StoreCreate,
  type StoreUpdate,
} from '../../../schemas/store'
import {
  useCreateStore,
  useGetMeStore,
  useUpdateStore,
} from '../../../hooks/catalogs/useStores'
import { useCategories } from '../../../hooks/catalogs/useCategories'

type StoreFormProps = {
  mode: 'create' | 'edit'
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function appendIfDefined(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return
  // FIX (ponto 1): number-like fields com valueAsNumber podem virar NaN
  // quando o input fica vazio. Sem esse guard, "NaN" era enviado como string.
  if (typeof value === 'number' && Number.isNaN(value)) return
  formData.append(key, String(value))
}

function appendAddressFields(formData: FormData, address: Record<string, unknown>) {
  Object.entries(address).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return
    if (typeof value === 'number' && Number.isNaN(value)) return
    formData.append(key, String(value))
  })
}

/**
 * Valida tipo e tamanho de um arquivo de imagem antes do envio.
 * Retorna uma mensagem de erro (string) se inválido, ou null se ok.
 */
function validateImageFile(file: File | undefined): string | null {
  if (!file) return null
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Formato inválido. Envie um arquivo JPG, PNG ou WEBP.'
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'Arquivo muito grande. O tamanho máximo é 5MB.'
  }
  return null
}

export function StoreForm({ mode }: StoreFormProps) {
  const navigate = useNavigate()
  const isCreate = mode === 'create'

  // Estados apenas para os previews das imagens (URLs)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const { data: categories, isPending: isCategoriesPending, error: categoriesError } = useCategories()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<StoreCreate | StoreUpdate>({
    resolver: zodResolver(isCreate ? storeCreateSchema : storeUpdateSchema),
  })

  // O RHF é o dono dos arquivos! Usamos watch para pegar os FileList
  const imageFile = watch('image')
  const bannerFile = watch('banner')

  const {
    data: store,
    isPending: isStoreLoading,
    error: storeError,
  } = useGetMeStore({
    enabled: mode === 'edit',
  })

  // Mapeia erros da API para os campos do RHF (suporta campos aninhados como address.zip_code)
  function mapApiErrors(error: unknown) {
    if (!isAxiosError(error) || !error.response?.data) return

    const data = error.response.data

    // FastAPI / Ninja style
    if (data?.detail && Array.isArray(data.detail)) {
      for (const item of data.detail) {
        if (item?.loc && Array.isArray(item.loc)) {
          const fieldName = item.loc.join('.') // Suporta 'address.zip_code'
          setError(fieldName as any, {
            type: 'server',
            message: item?.msg ?? 'Campo inválido',
          })
        }
      }
      return
    }

    // DRF / Django Ninja com dict de erros
    if (typeof data === 'object' && !Array.isArray(data)) {
      for (const [field, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          setError(field as any, { type: 'server', message: String(value[0]) })
        } else if (typeof value === 'string') {
          setError(field as any, { type: 'server', message: value })
        }
      }
    }
  }

  const createStoreMutation = useCreateStore({
    onSuccess: () => navigate('/artisan/dashboard'),
    onError: mapApiErrors,
  })

  const updateStoreMutation = useUpdateStore({
    onSuccess: () => navigate('/artisan/dashboard'),
    onError: mapApiErrors,
  })

  // Popula o formulário quando carregar os dados da loja (modo edit)
  useEffect(() => {
    if (mode !== 'edit') return
    if (isStoreLoading) return

    if (storeError || !store) {
      console.error('Erro ao carregar loja:', storeError)
      navigate('/artisan/dashboard')
      return
    }

    reset({
      name: store.name,
      description: store.description ?? '',
      // FIX (ponto 5): category_id não é usado em buildUpdateFormData (a categoria
      // não é editável no modo edit), então não faz sentido popular esse campo
      // no reset — era um estado "morto" no form.
      pix_key: store.pix_key ?? '',
      address: {
        zip_code: store.address?.zip_code ?? '',
        number: store.address?.number,
        street: store.address?.street ?? '',
        complement: store.address?.complement ?? '',
        neighborhood: store.address?.neighborhood ?? '',
        city: store.address?.city ?? '',
        state: store.address?.state ?? '',
      },
    })

    // Seta os previews iniciais com as URLs do backend
    setImagePreview(store.image ?? null)
    setBannerPreview(store.banner ?? null)
  }, [mode, isStoreLoading, store, storeError, navigate, reset])

  // Gera preview dinâmico quando o usuário seleciona uma nova imagem
  useEffect(() => {
    if (!imageFile?.[0]) return
    const url = URL.createObjectURL(imageFile[0])
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  useEffect(() => {
    if (!bannerFile?.[0]) return
    const url = URL.createObjectURL(bannerFile[0])
    setBannerPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [bannerFile])

  const isSubmitting =
    isFormSubmitting || createStoreMutation.isPending || updateStoreMutation.isPending

  function buildCreateFormData(data: StoreCreate): FormData {
    const formData = new FormData()

    appendIfDefined(formData, 'name', data.name)
    appendIfDefined(formData, 'description', data.description ?? '')
    appendIfDefined(formData, 'category_id', Number(data.category_id))
    appendIfDefined(formData, 'pix_key', data.pix_key)

    if (data.address) {
      appendAddressFields(formData, data.address as Record<string, unknown>)
    }

    const image = imageFile?.[0]
    const banner = bannerFile?.[0]
    if (image) formData.append('image', image)
    if (banner) formData.append('banner', banner)

    return formData
  }

  function buildUpdateFormData(data: StoreUpdate): FormData {
    const formData = new FormData()

    appendIfDefined(formData, 'description', data.description ?? '')

    if (data.address) {
      appendAddressFields(formData, data.address as Record<string, unknown>)
    }

    const image = imageFile?.[0]
    const banner = bannerFile?.[0]
    if (image) formData.append('image', image)
    if (banner) formData.append('banner', banner)

    return formData
  }

  function onSubmit(data: StoreCreate | StoreUpdate) {
    // FIX (ponto 3): validação client-side de tipo/tamanho de arquivo,
    // além do "accept" do input (que não impede o usuário de burlar).
    const imageError = validateImageFile(imageFile?.[0])
    if (imageError) {
      setError('image' as any, { type: 'manual', message: imageError })
      return
    }
    const bannerError = validateImageFile(bannerFile?.[0])
    if (bannerError) {
      setError('banner' as any, { type: 'manual', message: bannerError })
      return
    }

    // FIX (ponto 4): guarda extra e explícita para categoria não selecionada
    // no modo criação, com mensagem amigável (independente da mensagem do Zod).
    if (isCreate && Number((data as StoreCreate).category_id) === 0) {
      setError('category_id' as any, {
        type: 'manual',
        message: 'Selecione uma categoria',
      })
      return
    }

    if (isCreate) {
      const formData = buildCreateFormData(data as StoreCreate)
      createStoreMutation.mutate(formData as never)
      return
    }

    const formData = buildUpdateFormData(data as StoreUpdate)
    updateStoreMutation.mutate(formData as never)
  }

  function onInvalid(formErrors: unknown) {
    console.error('[StoreForm] Falha de validação, submit bloqueado:', formErrors)
  }

  if (mode === 'edit' && isStoreLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-text/60 mt-4">Carregando loja...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen py-8">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-6 max-w-3xl w-full px-4">
        <div className="text-center">
          <h2 className="font-title text-2xl text-primary font-bold">
            {isCreate ? 'Criar Minha Loja' : 'Editar Loja'}
          </h2>
          <p className="text-sm text-text/50 mt-1">
            {isCreate
              ? 'Configure sua loja e comece a vender'
              : 'Atualize as informações da sua loja'}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-title text-lg text-primary">Informações da Loja</h3>

          <Input
            label={isCreate ? 'Nome da Loja*' : 'Nome da Loja'}
            {...register('name')}
            placeholder="Ateliê das Flores"
            disabled={!isCreate}
            error={errors.name?.message}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Descrição</label>
            <textarea
              {...register('description')}
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
              <p className="text-xs text-danger">{errors.description.message}</p>
            )}
          </div>

          {isCreate ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Categoria*</label>
              <select
                {...register('category_id', { valueAsNumber: true })}
                className={`
                  h-10 w-full rounded-full border border-primary/20 bg-surface
                  px-4 text-sm text-text outline-none transition-colors
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  ${errors.category_id ? 'border-danger' : ''}
                `}
              >
                <option value={0} disabled>
                  Selecione uma categoria
                </option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-danger">{errors.category_id.message}</p>
              )}
            </div>
          ) : (
            <Input
              label="Categoria"
              value={store?.category?.name ?? ''}
              disabled
            />
          )}

          {isCreate && (
            <Input
              label="Chave PIX*"
              {...register('pix_key')}
              placeholder="artesao@email.com"
              error={errors.pix_key?.message}
            />
          )}
        </div>

        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-title text-lg text-primary">Imagens</h3>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-text">Logo da Loja</p>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Logo"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
              />
            )}
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/20 rounded-2xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
              <Upload size={20} className="text-primary/40" />
              <span className="text-sm text-primary/60">
                {isCreate
                  ? 'Clique para fazer upload da logo'
                  : 'Clique para atualizar a logo'}
              </span>
              <span className="text-xs text-text/40">JPG, PNG, WEBP (máx. 5MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                {...register('image')}
              />
            </label>
            {errors.image && (
              <p className="text-xs text-danger">{errors.image.message as string}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-text">Banner da Loja</p>
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner"
                className="w-full h-32 rounded-2xl object-cover border-2 border-primary/20"
              />
            )}
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/20 rounded-2xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
              <Upload size={20} className="text-primary/40" />
              <span className="text-sm text-primary/60">
                {isCreate
                  ? 'Clique para fazer upload do banner'
                  : 'Clique para atualizar o banner'}
              </span>
              <span className="text-xs text-text/40">JPG, PNG, WEBP (máx. 5MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                {...register('banner')}
              />
            </label>
            {errors.banner && (
              <p className="text-xs text-danger">{errors.banner.message as string}</p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-title text-lg text-primary">Endereço</h3>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CEP*"
              {...register('address.zip_code')}
              placeholder="59965-000"
              maxLength={9}
              error={errors.address?.zip_code?.message}
            />
            <Input
              label="Número*"
              type="number"
              {...register('address.number', { valueAsNumber: true })}
              placeholder="442"
              error={errors.address?.number?.message}
            />
          </div>

          <Input
            label="Rua*"
            {...register('address.street')}
            placeholder="Rua das Araucarias"
            error={errors.address?.street?.message}
          />

          <Input
            label="Complemento"
            {...register('address.complement')}
            placeholder="Apto 101"
            error={errors.address?.complement?.message}
          />

          <Input
            label="Bairro*"
            {...register('address.neighborhood')}
            placeholder="Centro"
            error={errors.address?.neighborhood?.message}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cidade*"
              {...register('address.city')}
              placeholder="Alexandria"
              error={errors.address?.city?.message}
            />
            <Input
              label="Estado (UF)*"
              {...register('address.state')}
              placeholder="RN"
              maxLength={2}
              error={errors.address?.state?.message}
            />
          </div>

          {errors.address && (
            <p className="text-xs text-danger">Verifique os campos de endereço</p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="danger"
            onClick={() => navigate('/artisan/dashboard')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting} onClick={() => navigate('/artisan/store/profile')}>
            {isSubmitting ? 'Salvando...' : isCreate ? 'Criar Loja' : 'Salvar Alterações'}
            
          </Button>
        </div>
      </form>
    </div>
  )
}