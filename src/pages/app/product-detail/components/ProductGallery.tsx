import type { ProductImage } from '../../../../dtos/product'

type ProductGalleryProps = {
  images: ProductImage[]
  selected: ProductImage | null
  onSelect: (image: ProductImage) => void
}

export function ProductGallery({ images, selected, onSelect }: ProductGalleryProps) {
  if (!images.length) {
    return (
      <div className="aspect-square bg-surface rounded-2xl flex items-center justify-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="flex flex-col gap-2">
        {images.map(img => (
          <button
            key={img.id}
            onClick={() => onSelect(img)}
            className={`
              w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors shrink-0
              ${selected?.id === img.id ? 'border-primary' : 'border-transparent'}
            `}
          >
            <img src={img.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div className="relative flex-1 bg-surface rounded-2xl overflow-hidden aspect-square">
        {selected && (
          <img
            src={selected.url}
            alt="Imagem do produto"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  )
}