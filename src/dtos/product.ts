export type ProductImage = {
  id: number
  url: string
  is_primary: boolean
}

export type ProductVariation = {
  id: number
  price: number
  weight: number
  length: number
  width: number
  height: number
  sku: string | null
  stock: number
  color: string | null
  size: string | null
  images: ProductImage[]
}

export type Product = {
  id: number
  name: string
  description: string
  store_id: number
  is_active: boolean
  variations: ProductVariation[]

  // virão de outros endpoints futuramente
  shopName?: string
  rating?: number
  reviewCount?: number
  monthlySales?: string
  discount?: number
  deliveryDate?: string
  freeShipping?: boolean
  fastDelivery?: boolean

  // Detalhes do produto - acrecentar no back, caso não tenha 
  highlights?: string[]
  about?: string
}