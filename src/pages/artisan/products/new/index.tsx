import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import { Input } from '../../../../components/ui/Input'
import { Button } from '../../../../components/ui/Button'
import type { ProductVariationCreate } from '../../../../schemas/product'
import { productCreateSchema } from '../../../../schemas/product'

const EMPTY_VARIATION: ProductVariationCreate = {
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
}

type FormErrors = Partial<Record<string, string>>

export function NewProduct() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [variations, setVariations] = useState<ProductVariationCreate[]>([{ ...EMPTY_VARIATION }])
  const [errors, setErrors] = useState<FormErrors>({})

  // variação handlers
  function handleVariationChange(
    index: number,
    field: keyof ProductVariationCreate,
    value: string | number | null,
  ) {
    setVariations(prev => prev.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    ))
  }

  function addVariation() {
    setVariations(prev => [...prev, { ...EMPTY_VARIATION }])
  }

  function removeVariation(index: number) {
    setVariations(prev => prev.filter((_, i) => i !== index))
  }

  // imagem handlers
  function handleImageUpload(index: number, files: FileList | null) {
    if (!files) return
    const urls = Array.from(files).map((file, i) => ({
      url: URL.createObjectURL(file),
      is_primary: i === 0,
    }))
    setVariations(prev => prev.map((v, i) =>
      i === index ? { ...v, images: [...v.images, ...urls] } : v
    ))
  }

  function removeImage(varIndex: number, imgIndex: number) {
    setVariations(prev => prev.map((v, i) =>
      i === varIndex
        ? { ...v, images: v.images.filter((_, j) => j !== imgIndex) }
        : v
    ))
  }

  function setPrimaryImage(varIndex: number, imgIndex: number) {
    setVariations(prev => prev.map((v, i) =>
      i === varIndex
        ? { ...v, images: v.images.map((img, j) => ({ ...img, is_primary: j === imgIndex })) }
        : v
    ))
  }


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = productCreateSchema.safeParse({ name, description, variations })

    if (!result.success) {
      const flat = result.error.flatten()
      const fieldErrors: FormErrors = {}
      if (flat.fieldErrors.name) fieldErrors.name = flat.fieldErrors.name[0]
      if (flat.fieldErrors.description) fieldErrors.description = flat.fieldErrors.description[0]
      if (flat.fieldErrors.variations) fieldErrors.variations = flat.fieldErrors.variations[0]
      setErrors(fieldErrors)
      return
    }

    // mock — POST /api/v1/catalog/products/
    console.log('Criar produto:', result.data)
    navigate('/artisan/products')
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-center">

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl ">

        <div className="text-center">
          <h2 className="font-title text-3xl text-primary font-bold">Cadastro do Produto</h2>
          <p className="text-sm text-text/50 mt-1">Crie e personalize seu produto com variantes e atributos</p>
        </div>

        {/* Informações do Produto */}
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-title text-lg text-primary">Informações do Produto</h3>

          <Input
            label="Nome*"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Digite o nome do produto"
            error={errors.name}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Descrição*</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
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
            {errors.description && (
              <p className="text-xs text-danger">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Variações */}
        {variations.map((variation, varIndex) => (
          <div key={varIndex} className="bg-card rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-title text-lg text-primary">
                Variação {varIndex + 1}
              </h3>
              {variations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariation(varIndex)}
                  className="text-danger hover:text-danger-dark transition-colors"
                  aria-label="Remover variação"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Atributos */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Cor"
                value={variation.color ?? ''}
                onChange={e => handleVariationChange(varIndex, 'color', e.target.value || null)}
                placeholder="Rosa Bebê"
              />
              <Input
                label="Tamanho"
                value={variation.size ?? ''}
                onChange={e => handleVariationChange(varIndex, 'size', e.target.value || null)}
                placeholder="P / M / G / U"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Preço (R$)*"
                type="number"
                value={variation.price || ''}
                onChange={e => handleVariationChange(varIndex, 'price', Number(e.target.value))}
                placeholder="0,00"
                min={0}
                step={0.01}
              />
              <Input
                label="Estoque*"
                type="number"
                value={variation.stock || ''}
                onChange={e => handleVariationChange(varIndex, 'stock', Number(e.target.value))}
                placeholder="0"
                min={0}
              />
            </div>

            <Input
              label="SKU"
              value={variation.sku ?? ''}
              onChange={e => handleVariationChange(varIndex, 'sku', e.target.value || null)}
              placeholder="LAC-001-ROSA"
            />

            {/* Dimensões */}
            <div>
              <p className="text-sm font-medium text-text mb-2">Dimensões (cm) e Peso (kg)*</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Input
                  label="Comprimento"
                  type="number"
                  value={variation.length || ''}
                  onChange={e => handleVariationChange(varIndex, 'length', Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  step={0.1}
                />
                <Input
                  label="Largura"
                  type="number"
                  value={variation.width || ''}
                  onChange={e => handleVariationChange(varIndex, 'width', Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  step={0.1}
                />
                <Input
                  label="Altura"
                  type="number"
                  value={variation.height || ''}
                  onChange={e => handleVariationChange(varIndex, 'height', Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  step={0.1}
                />
                <Input
                  label="Peso (kg)"
                  type="number"
                  value={variation.weight || ''}
                  onChange={e => handleVariationChange(varIndex, 'weight', Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            {/* Upload de imagens */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-text">Imagens</p>

              {variation.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {variation.images.map((img, imgIndex) => (
                    <div key={imgIndex} className="relative group">
                      <img
                        src={img.url}
                        alt=""
                        className={`
                          w-20 h-20 rounded-xl object-cover cursor-pointer border-2 transition-colors
                          ${img.is_primary ? 'border-primary' : 'border-transparent'}
                        `}
                        onClick={() => setPrimaryImage(varIndex, imgIndex)}
                      />
                      {img.is_primary && (
                        <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-white rounded px-1">
                          Principal
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(varIndex, imgIndex)}
                        className="absolute -top-1.5 -right-1.5 bg-danger text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className={`
                flex flex-col items-center justify-center gap-2
                border-2 border-dashed border-primary/20 rounded-2xl
                p-8 cursor-pointer hover:border-primary/50 transition-colors
              `}>
                <Upload size={24} className="text-primary/40" />
                <span className="text-sm text-primary/60">Clique para fazer upload da imagem</span>
                <span className="text-xs text-text/40">Formatos suportados: JPG, PNG, WEBP (máx. 5MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={e => handleImageUpload(varIndex, e.target.files)}
                />
              </label>
            </div>
          </div>
        ))}

        {errors.variations && (
          <p className="text-xs text-danger">{errors.variations}</p>
        )}


        <button
          type="button"
          onClick={addVariation}
          className="flex items-center justify-center gap-2 border-2 border-dashed border-primary/20 rounded-2xl p-4 text-sm text-primary/60 hover:border-primary/50 hover:text-primary transition-colors"
        >
          <Plus size={16} />
          Adicionar outra variação
        </button>

        
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="danger"
            onClick={() => navigate('/artisan/products')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant='secondary'>
            Cadastrar Produto
          </Button>
        </div>

      </form>
    </div>
  )
}