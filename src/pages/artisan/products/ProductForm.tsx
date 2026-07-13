// src/pages/artisan/products/ProductForm.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import type { Product } from '../../../schemas/product'
import { productCreateSchema } from '../../../schemas/product'
import { api } from '../../../api/client' 

type ProductFormProps = {
  mode: 'create' | 'edit'
}

type FormErrors = Partial<Record<'name' | 'description' | 'variations', string>>

type VariationImageForm = {
  url: string
  is_primary: boolean
  file?: File
}

type VariationForm = {
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

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [variations, setVariations] = useState<VariationForm[]>([createEmptyVariation()])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(mode === 'edit')

  async function loadProduct(productId: string) {
    try {
      setIsLoading(true)

      // TODO: trocar pelo endpoint real
      // const { data } = await api.get<Product>(`/products/${productId}`)
      // const product = data

      const product: Product = {
        id: Number(productId),
        name: 'Laço Borboleta',
        description: 'Laço artesanal feito à mão',
        store_id: 1,
        is_active: true,
        variations: [
          {
            id: 1,
            price: 28.0,
            weight: 0.1,
            length: 10,
            width: 8,
            height: 2,
            sku: 'LAC-001',
            stock: 15,
            color: 'Rosa',
            size: 'U',
            images: [
              { id: 1, url: 'https://placehold.co/400x400?text=Laco', is_primary: true },
            ],
          },
        ],
      }

      setName(product.name)
      setDescription(product.description)

      setVariations(
        product.variations.map((v) => ({
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
            url: img.url,
            is_primary: img.is_primary,
          })),
        })),
      )
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      navigate('/artisan/products')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadProduct(id)
    }
  }, [mode, id])

  function handleVariationChange(
    index: number,
    field: Exclude<keyof VariationForm, 'images' | 'temp_id'>,
    value: string | number | null,
  ) {
    setVariations((prev) =>
      prev.map((variation, i) =>
        i === index ? { ...variation, [field]: value } : variation,
      ),
    )
  }

  function addVariation() {
    setVariations((prev) => [...prev, createEmptyVariation()])
  }

  function removeVariation(index: number) {
    setVariations((prev) => prev.filter((_, i) => i !== index))
  }

  function handleImageUpload(index: number, files: FileList | null) {
    if (!files || files.length === 0) return

    const newImages: VariationImageForm[] = Array.from(files).map((file, i) => ({
      url: URL.createObjectURL(file),
      file,
      is_primary: i === 0,
    }))

    setVariations((prev) =>
      prev.map((variation, i) =>
        i === index
          ? {
              ...variation,
              images: [
                ...variation.images,
                ...newImages.map((img, imgIndex) => ({
                  ...img,
                  is_primary: variation.images.length === 0 ? imgIndex === 0 : img.is_primary,
                })),
              ],
            }
          : variation,
      ),
    )
  }

  function removeImage(varIndex: number, imgIndex: number) {
    setVariations((prev) =>
      prev.map((variation, i) =>
        i === varIndex
          ? {
              ...variation,
              images: variation.images.filter((_, j) => j !== imgIndex),
            }
          : variation,
      ),
    )
  }

  function setPrimaryImage(varIndex: number, imgIndex: number) {
    setVariations((prev) =>
      prev.map((variation, i) =>
        i === varIndex
          ? {
              ...variation,
              images: variation.images.map((img, j) => ({
                ...img,
                is_primary: j === imgIndex,
              })),
            }
          : variation,
      ),
    )
  }

  function buildPayload() {
    return {
      name,
      description,
      variations: variations.map((variation) => ({
        temp_id: variation.temp_id,
        price: variation.price,
        weight: variation.weight,
        length: variation.length,
        width: variation.width,
        height: variation.height,
        sku: variation.sku,
        stock: variation.stock,
        color: variation.color,
        size: variation.size,
      })),
    }
  }

  function buildFormData() {
    const formData = new FormData()
    const payload = buildPayload()

    formData.append('payload', JSON.stringify(payload))

    variations.forEach((variation) => {
      variation.images.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file)
          formData.append('image_variant_ids', variation.temp_id)
        }
      })
    })

    return formData
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const payload = buildPayload()
    const result = productCreateSchema.safeParse(payload)

    if (!result.success) {
      const flat = result.error.flatten()
      const fieldErrors: FormErrors = {}

      if (flat.fieldErrors.name?.[0]) fieldErrors.name = flat.fieldErrors.name[0]
      if (flat.fieldErrors.description?.[0]) fieldErrors.description = flat.fieldErrors.description[0]
      if (flat.fieldErrors.variations?.[0]) fieldErrors.variations = flat.fieldErrors.variations[0]

      setErrors(fieldErrors)
      return
    }

    const formData = buildFormData()

    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        await api.post('api/v1/catalog/products/', formData)
      } else if (id) {
        await api.patch(`/products/${id}`, formData)
      }

      navigate('/artisan/products')
    } catch (error: any) {
      if (error?.response?.status === 400) {
        const apiErrors = error.response.data
        setErrors({
          name: apiErrors?.name?.[0],
          description: apiErrors?.description?.[0],
          variations: apiErrors?.variations?.[0],
        })
      } else {
        setErrors({ name: 'Erro ao salvar produto. Tente novamente.' })
      }
    } finally {
      setIsSubmitting(false)
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
      <form onSubmit={handleSubmit} className="flex w-full max-w-3xl flex-col gap-6">
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

        <div className="bg-card flex flex-col gap-4 rounded-2xl p-6">
          <h3 className="font-title text-lg text-primary">Informações do Produto</h3>

          <Input
            label="Nome*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do produto"
            error={errors.name}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Descrição*</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o produto"
              rows={4}
              className={`
                w-full rounded-2xl border border-primary/20 bg-surface
                px-4 py-3 text-sm text-text placeholder:text-text/40
                outline-none transition-colors resize-none
                focus:border-primary focus:ring-2 focus:ring-primary/20
                ${errors.description ? 'border-danger' : ''}
              `}
            />
            {errors.description && <p className="text-xs text-danger">{errors.description}</p>}
          </div>
        </div>

        {variations.map((variation, varIndex) => (
          <div key={variation.temp_id} className="bg-card flex flex-col gap-4 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-title text-lg text-primary">Variação {varIndex + 1}</h3>

              {variations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariation(varIndex)}
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
                value={variation.color ?? ''}
                onChange={(e) =>
                  handleVariationChange(varIndex, 'color', e.target.value || null)
                }
                placeholder="Rosa Bebê"
              />
              <Input
                label="Tamanho"
                value={variation.size ?? ''}
                onChange={(e) =>
                  handleVariationChange(varIndex, 'size', e.target.value || null)
                }
                placeholder="P / M / G / U"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Preço (R$)*"
                type="number"
                value={variation.price || ''}
                onChange={(e) =>
                  handleVariationChange(varIndex, 'price', Number(e.target.value))
                }
                placeholder="0,00"
                min={0}
                step={0.01}
              />
              <Input
                label="Estoque*"
                type="number"
                value={variation.stock || ''}
                onChange={(e) =>
                  handleVariationChange(varIndex, 'stock', Number(e.target.value))
                }
                placeholder="0"
                min={0}
              />
            </div>

            <Input
              label="SKU"
              value={variation.sku ?? ''}
              onChange={(e) =>
                handleVariationChange(varIndex, 'sku', e.target.value || null)
              }
              placeholder="LAC-001-ROSA"
            />

            <div>
              <p className="mb-2 text-sm font-medium text-text">
                Dimensões (cm) e Peso (kg)*
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Input
                  label="Comprimento"
                  type="number"
                  value={variation.length || ''}
                  onChange={(e) =>
                    handleVariationChange(varIndex, 'length', Number(e.target.value))
                  }
                  placeholder="0"
                  min={0}
                  step={0.1}
                />
                <Input
                  label="Largura"
                  type="number"
                  value={variation.width || ''}
                  onChange={(e) =>
                    handleVariationChange(varIndex, 'width', Number(e.target.value))
                  }
                  placeholder="0"
                  min={0}
                  step={0.1}
                />
                <Input
                  label="Altura"
                  type="number"
                  value={variation.height || ''}
                  onChange={(e) =>
                    handleVariationChange(varIndex, 'height', Number(e.target.value))
                  }
                  placeholder="0"
                  min={0}
                  step={0.1}
                />
                <Input
                  label="Peso (kg)"
                  type="number"
                  value={variation.weight || ''}
                  onChange={(e) =>
                    handleVariationChange(varIndex, 'weight', Number(e.target.value))
                  }
                  placeholder="0"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-text">Imagens</p>

              {variation.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {variation.images.map((img, imgIndex) => (
                    <div key={`${variation.temp_id}-${imgIndex}`} className="group relative">
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
        ))}

        {errors.variations && <p className="text-xs text-danger">{errors.variations}</p>}

        <button
          type="button"
          onClick={addVariation}
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