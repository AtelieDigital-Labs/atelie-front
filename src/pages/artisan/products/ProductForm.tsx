import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Upload, X } from 'lucide-react'

import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { productCreateSchema } from '../../../schemas/product'
import { useProduct, useCreateProduct, useUpdateProduct } from '../../../hooks/catalogs/useProducts'

type ProductFormProps = {
  mode: 'create' | 'edit'
}

type VariationImageForm = {
  id?: number // Preserva o ID do banco de dados na edição
  url: string
  is_primary: boolean
  file?: File // Presente apenas em novas imagens carregadas no front
}

type VariationForm = {
  id?: number // Preserva o ID do banco de dados na edição
  temp_id: string
  price: number
  weight: number
  length: number
  width: number
  height: number
  sku: string | null
  stock: number
  color: string | null
  size: string | null
  images: VariationImageForm[]
}

type ProductFormValues = {
  name: string
  description: string
  variations: VariationForm[]
}

const createEmptyVariation = (): VariationForm => ({
  temp_id: crypto.randomUUID(),
  price: 0,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  sku: null,
  stock: 0,
  color: null,
  size: null,
  images: [],
})

export function ProductForm({ mode }: ProductFormProps) {
  const navigate = useNavigate()
  const { id } = useParams()

  // Queries e Mutations via TanStack Query
  const { data: product, isLoading: isLoadingProduct } = useProduct(mode === 'edit' ? Number(id) : undefined)
  const { mutate: createProductMutate, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProductMutate, isPending: isUpdating } = useUpdateProduct()

  const isSubmitting = isCreating || isUpdating
  const isLoading = mode === 'edit' && isLoadingProduct

  // Configuração do React Hook Form com Zod
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      variations: [createEmptyVariation()],
    },
  })

  // Gerenciamento dinâmico de Variações no RHF
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations',
  })

  // Popula o formulário com os dados da API ao editar
  useEffect(() => {
    if (mode === 'edit' && product) {
      reset({
        name: product.name,
        description: product.description,
        variations: product.variations.map((v) => ({
          id: v.id, // ID original preservado
          temp_id: crypto.randomUUID(),
          price: v.price,
          weight: v.weight,
          length: v.length,
          width: v.width,
          height: v.height,
          sku: v.sku,
          stock: v.stock,
          color: v.color,
          size: v.size,
          images: v.images.map((img) => ({
            id: img.id, // ID original preservado
            url: img.url,
            is_primary: img.is_primary,
          })),
        })),
      })
    }
  }, [mode, product, reset])

  // Manipulação otimizada de imagens utilizando getValues
  function handleImageUpload(varIndex: number, files: FileList | null) {
    if (!files || files.length === 0) return

    const currentVariations = getValues('variations')
    const currentImages = currentVariations[varIndex]?.images || []

    const newImages: VariationImageForm[] = Array.from(files).map((file, i) => ({
      url: URL.createObjectURL(file),
      file,
      is_primary: currentImages.length === 0 && i === 0,
    }))

    setValue(`variations.${varIndex}.images`, [...currentImages, ...newImages])
  }

  function removeImage(varIndex: number, imgIndex: number) {
    const currentVariations = getValues('variations')
    const currentImages = currentVariations[varIndex]?.images || []
    const updatedImages = currentImages.filter((_, j) => j !== imgIndex)

    const hasPrimary = updatedImages.some((img) => img.is_primary)
    if (!hasPrimary && updatedImages.length > 0) {
      updatedImages[0].is_primary = true
    }

    setValue(`variations.${varIndex}.images`, updatedImages)
  }

  function setPrimaryImage(varIndex: number, imgIndex: number) {
    const currentVariations = getValues('variations')
    const currentImages = currentVariations[varIndex]?.images || []
    const updatedImages = currentImages.map((img, j) => ({
      ...img,
      is_primary: j === imgIndex,
    }))

    setValue(`variations.${varIndex}.images`, updatedImages)
  }

  // Prepara o payload estrutural e anexa mídias novas ao FormData
  // Prepara o payload estrutural e anexa mídias novas ao FormData
  function buildFormData(data: ProductFormValues) {
    const formData = new FormData()

    // 💡 SOLUÇÃO: Buscamos as variações direto do estado interno do Hook Form.
    // Isso impede que o Zod filtre/remova o 'temp_id' caso ele não esteja no schema.
    const formVariations = getValues('variations')

    const payload = {
      name: data.name,
      description: data.description,
      variations: formVariations.map((v) => ({
        id: v.id || null, // Garante que o ID vá para o backend atualizar corretamente
        temp_id: v.temp_id, // Agora o temp_id está 100% garantido!
        price: v.price,
        weight: v.weight,
        length: v.length,
        width: v.width,
        height: v.height,
        sku: v.sku || null,
        stock: v.stock,
        color: v.color || null,
        size: v.size || null,
        // Retorna as imagens existentes (sem propriedade 'file') para que o backend não as remova
        images: v.images
          .filter((img) => !img.file)
          .map((img) => ({
            id: img.id,
            url: img.url,
            is_primary: img.is_primary,
          })),
      })),
    }

    formData.append('payload', JSON.stringify(payload))

    // Anexa apenas arquivos novos e associa ao respectivo UUID da variação
    formVariations.forEach((variation) => {
      variation.images.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file)
          formData.append('image_variant_ids', variation.temp_id)
        }
      })
    })

    return formData
  }

  const onSubmit = (data: ProductFormValues) => {
    // Validação preventiva no Front-end ao criar
    if (mode === 'create') {
      const hasAtLeastOneImage = data.variations.some((v) => v.images.length > 0)
      if (!hasAtLeastOneImage) {
        setError('root', {
          message: 'Você precisa adicionar pelo menos uma imagem ao produto.',
        })
        return
      }
    }

    const formData = buildFormData(data)

    const handleApiError = (error: any) => {
      if (error?.response?.status === 400) {
        const apiErrors = error.response.data
        if (apiErrors?.name?.[0]) setError('name', { message: apiErrors.name[0] })
        if (apiErrors?.description?.[0]) setError('description', { message: apiErrors.description[0] })
        if (apiErrors?.variations?.[0]) setError('root', { message: apiErrors.variations[0] })
      } else {
        setError('root', { message: 'Erro ao salvar produto. Tente novamente.' })
      }
    }

    if (mode === 'create') {
      createProductMutate(formData, {
        onSuccess: () => navigate('/artisan/products'),
        onError: handleApiError,
      })
    } else if (id) {
      updateProductMutate(
        { id: Number(id), formData },
        {
          onSuccess: () => navigate('/artisan/products'),
          onError: handleApiError,
        },
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-text/60">Carregando produto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-3xl flex-col gap-6">
        <div className="text-center">
          <h2 className="font-title text-3xl font-bold text-primary">
            {mode === 'create' ? 'Cadastro do Produto' : 'Editar Produto'}
          </h2>
          <p className="mt-1 text-sm text-text/50">
            {mode === 'create'
              ? 'Crie e personalize seu produto com variantes e atributos'
              : 'Atualize as informações do seu produto'}
          </p>
        </div>

        {/* Informações Gerais do Produto */}
        <div className="bg-card flex flex-col gap-4 rounded-2xl p-6">
          <h3 className="font-title text-lg text-primary">Informações do Produto</h3>

          <Input
            label="Nome*"
            placeholder="Digite o nome do produto"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Descrição*</label>
            <textarea
              placeholder="Descreva o produto"
              rows={4}
              className={`
                w-full rounded-2xl border border-primary/20 bg-surface
                px-4 py-3 text-sm text-text placeholder:text-text/40
                outline-none transition-colors resize-none
                focus:border-primary focus:ring-2 focus:ring-primary/20
                ${errors.description ? 'border-danger' : ''}
              `}
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
          </div>
        </div>

        {/* Variações Dinâmicas */}
        {fields.map((field, varIndex) => {
          // Utiliza o watch local para atualizar a lista de imagens dinamicamente
          const variationImages = watch(`variations.${varIndex}.images`) || []

          return (
            <div key={field.id} className="bg-card flex flex-col gap-4 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-title text-lg text-primary">Variação {varIndex + 1}</h3>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(varIndex)}
                    className="text-danger transition-colors hover:text-danger-dark"
                    aria-label="Remover variação"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Cor"
                  placeholder="Rosa Bebê"
                  error={errors.variations?.[varIndex]?.color?.message}
                  {...register(`variations.${varIndex}.color`)}
                />
                <Input
                  label="Tamanho"
                  placeholder="P / M / G / U"
                  error={errors.variations?.[varIndex]?.size?.message}
                  {...register(`variations.${varIndex}.size`)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Preço (R$)*"
                  type="number"
                  placeholder="0,00"
                  min={0}
                  step={0.01}
                  error={errors.variations?.[varIndex]?.price?.message}
                  {...register(`variations.${varIndex}.price`, { valueAsNumber: true })}
                />
                <Input
                  label="Estoque*"
                  type="number"
                  placeholder="0"
                  min={0}
                  error={errors.variations?.[varIndex]?.stock?.message}
                  {...register(`variations.${varIndex}.stock`, { valueAsNumber: true })}
                />
              </div>

              <Input
                label="SKU"
                placeholder="LAC-001-ROSA"
                error={errors.variations?.[varIndex]?.sku?.message}
                {...register(`variations.${varIndex}.sku`)}
              />

              {/* Dimensões e Peso */}
              <div>
                <p className="mb-2 text-sm font-medium text-text">
                  Dimensões (cm) e Peso (kg)*
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Input
                    label="Comprimento"
                    type="number"
                    placeholder="0"
                    min={0}
                    step={0.1}
                    error={errors.variations?.[varIndex]?.length?.message}
                    {...register(`variations.${varIndex}.length`, { valueAsNumber: true })}
                  />
                  <Input
                    label="Largura"
                    type="number"
                    placeholder="0"
                    min={0}
                    step={0.1}
                    error={errors.variations?.[varIndex]?.width?.message}
                    {...register(`variations.${varIndex}.width`, { valueAsNumber: true })}
                  />
                  <Input
                    label="Altura"
                    type="number"
                    placeholder="0"
                    min={0}
                    step={0.1}
                    error={errors.variations?.[varIndex]?.height?.message}
                    {...register(`variations.${varIndex}.height`, { valueAsNumber: true })}
                  />
                  <Input
                    label="Peso (kg)"
                    type="number"
                    placeholder="0"
                    min={0}
                    step={0.01}
                    error={errors.variations?.[varIndex]?.weight?.message}
                    {...register(`variations.${varIndex}.weight`, { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* Seção de Upload de Imagens */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-text">Imagens</p>

                {variationImages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {variationImages.map((img, imgIndex) => (
                      <div key={`${field.id}-img-${imgIndex}`} className="group relative">
                        <img
                          src={img.url}
                          alt=""
                          className={`
                            h-20 w-20 cursor-pointer rounded-xl border-2 object-cover transition-colors
                            ${img.is_primary ? 'border-primary' : 'border-transparent'}
                          `}
                          onClick={() => setPrimaryImage(varIndex, imgIndex)}
                        />
                        {img.is_primary && (
                          <span className="absolute bottom-1 left-1 rounded bg-primary px-1 text-[10px] text-white">
                            Principal
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(varIndex, imgIndex)}
                          className="absolute -right-1.5 -top-1.5 rounded-full bg-danger p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/20 p-8 transition-colors hover:border-primary/50">
                  <Upload size={24} className="text-primary/40" />
                  <span className="text-sm text-primary/60">Clique para fazer upload da imagem</span>
                  <span className="text-xs text-text/40">
                    Formatos suportados: JPG, PNG, WEBP (máx. 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageUpload(varIndex, e.target.files)}
                  />
                </label>
              </div>
            </div>
          )
        })}

        {errors.root && <p className="text-xs text-danger text-center font-semibold">{errors.root.message}</p>}

        <button
          type="button"
          onClick={() => append(createEmptyVariation())}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/20 p-4 text-sm text-primary/60 transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Plus size={16} />
          Adicionar outra variação
        </button>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="danger" onClick={() => navigate('/artisan/products')}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Cadastrando...'
                : 'Salvando...'
              : mode === 'create'
                ? 'Cadastrar Produto'
                : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  )
}