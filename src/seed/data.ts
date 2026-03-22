export type SeedCategory = {
  id: string
  name: string
  slug: string
}

export type SeedColor = {
  id: string
  name: string
  hex: string
}

export type SeedSize = {
  id: string
  label: string
  value: string
}

export type SeedProductVariant = {
  colorId: SeedColor['id']
  sizeId: SeedSize['id']
  sku: string
  stock: number
}

export type SeedProduct = {
  id: string
  name: string
  price: number
  categoryId: SeedCategory['id']
  imageUrl: string
  variants: SeedProductVariant[]
}

export type SeedHeroImage = {
  id: string
  alt: string
  url: string
}

export type SeedCarouselImage = {
  id: string
  alt: string
  url: string
}

export const seedCategories: SeedCategory[] = [
  { id: '1', name: 'T-Shirts', slug: 't-shirts' },
  { id: '2', name: 'Hoodies', slug: 'hoodies' },
  { id: '3', name: 'Outerwear', slug: 'outerwear' },
  { id: '4', name: 'Dresses', slug: 'dresses' },
]

export const seedColors: SeedColor[] = [
  { id: 'color-off-white', name: 'Off White', hex: '#FAF9F6' },
  { id: 'color-charcoal', name: 'Charcoal', hex: '#36454F' },
  { id: 'color-navy', name: 'Navy', hex: '#000080' },
  { id: 'color-sand', name: 'Sand', hex: '#C2B280' },
]

export const seedSizes: SeedSize[] = [
  { id: 'size-s', label: 'Small', value: 's' },
  { id: 'size-m', label: 'Medium', value: 'm' },
  { id: 'size-l', label: 'Large', value: 'l' },
  { id: 'size-xl', label: 'Extra Large', value: 'xl' },
]

export const seedProductDescription = (name: string): string =>
  `Professional studio photography of a model in ${name}. Minimalist urban aesthetic with soft lighting.`

export const seedProducts: SeedProduct[] = [
  {
    id: 'p1',
    name: 'Heavyweight Boxy Tee',
    price: 45,
    categoryId: '1',
    imageUrl:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-off-white', sizeId: 'size-m', sku: 'HEA-WHT-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'HEA-CHR-L', stock: 5 },
    ],
  },
  {
    id: 'p2',
    name: 'Core French Terry Hoodie',
    price: 85,
    categoryId: '2',
    imageUrl:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-off-white', sizeId: 'size-m', sku: 'COR-WHT-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'COR-CHR-L', stock: 5 },
    ],
  },
  {
    id: 'p3',
    name: 'Minimalist Nylon Bomber',
    price: 140,
    categoryId: '3',
    imageUrl:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-off-white', sizeId: 'size-m', sku: 'MIN-WHT-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'MIN-CHR-L', stock: 5 },
    ],
  },
  {
    id: 'p4',
    name: 'Structured Midi Dress',
    price: 115,
    categoryId: '4',
    imageUrl:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-off-white', sizeId: 'size-m', sku: 'STR-WHT-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'STR-CHR-L', stock: 5 },
    ],
  },
  {
    id: 'p5',
    name: 'Essential Sand Hoodie',
    price: 85,
    categoryId: '2',
    imageUrl:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-sand', sizeId: 'size-m', sku: 'ESS-SND-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'ESS-CHR-L', stock: 5 },
    ],
  },
  {
    id: 'p6',
    name: 'Oversized Street Jacket',
    price: 160,
    categoryId: '3',
    imageUrl:
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-navy', sizeId: 'size-m', sku: 'OVE-NVY-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'OVE-CHR-L', stock: 5 },
    ],
  },
  {
    id: 'p7',
    name: 'Vintage Raw Denim Jacket',
    price: 125,
    categoryId: '3',
    imageUrl:
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-navy', sizeId: 'size-m', sku: 'VIN-NVY-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'VIN-CHR-L', stock: 5 },
    ],
  },
  {
    id: 'p8',
    name: 'Graphic Studio Tee',
    price: 50,
    categoryId: '1',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-off-white', sizeId: 'size-m', sku: 'GRA-WHT-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'GRA-CHR-L', stock: 5 },
    ],
  },
  {
    id: 'p9',
    name: 'Urban Shift Dress',
    price: 110,
    categoryId: '4',
    imageUrl:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-sand', sizeId: 'size-m', sku: 'URB-SND-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'URB-CHR-L', stock: 5 },
    ],
  },
  {
    id: 'p10',
    name: 'Monochrome Lounge Set',
    price: 95,
    categoryId: '1',
    imageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
    variants: [
      { colorId: 'color-off-white', sizeId: 'size-m', sku: 'MON-WHT-M', stock: 10 },
      { colorId: 'color-charcoal', sizeId: 'size-l', sku: 'MON-CHR-L', stock: 5 },
    ],
  },
]

export const seedHeroImages: SeedHeroImage[] = [
  {
    id: 'h1',
    alt: 'Premium Urban Streetwear Blue Hoodie',
    url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
  {
    id: 'h2',
    alt: 'High Fashion Editorial Street Style',
    url: 'https://images.unsplash.com/photo-1529139513364-c05315530182?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
  {
    id: 'h3',
    alt: 'Minimalist Black Oversized Hoodie',
    url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
  {
    id: 'h4',
    alt: 'Modern Denim and Premium Jacket Look',
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
  {
    id: 'h5',
    alt: 'Luxury Autumn Streetwear Fashion',
    url: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
]

export const seedCarouselImages: SeedCarouselImage[] = [
  { id: 'c1', alt: 'Alpine Mystique', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=480&h=650&fit=crop' },
  { id: 'c2', alt: 'Golden Solitude', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=480&h=650&fit=crop' },
  { id: 'c3', alt: 'Ethereal Dawn', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&h=650&fit=crop' },
  { id: 'c4', alt: 'Verdant Echoes', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=480&h=650&fit=crop' },
  { id: 'c5', alt: 'Midnight Harmony', url: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=480&h=650&fit=crop' },
  { id: 'c6', alt: 'Urban Minimalism', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&h=650&fit=crop' },
]

