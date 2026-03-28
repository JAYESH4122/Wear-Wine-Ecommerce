import type { Color, Size } from '@/payload-types'

export const now = new Date().toISOString()

export const colors = {
  white: { id: 1, name: 'Alabaster', hex: '#FAF9F6', createdAt: now, updatedAt: now },
  charcoal: { id: 2, name: 'Obsidian', hex: '#1A1A1A', createdAt: now, updatedAt: now },
  navy: { id: 3, name: 'Midnight', hex: '#000033', createdAt: now, updatedAt: now },
  sand: { id: 4, name: 'Oatmeal', hex: '#D2B48C', createdAt: now, updatedAt: now },
}

export const sizes = {
  s: { id: 1, label: 'S', value: 's', createdAt: now, updatedAt: now },
  m: { id: 2, label: 'M', value: 'm', createdAt: now, updatedAt: now },
  l: { id: 3, label: 'L', value: 'l', createdAt: now, updatedAt: now },
  xl: { id: 4, label: 'XL', value: 'xl', createdAt: now, updatedAt: now },
}

export const makeMedia = (id: number, url: string, alt: string) => ({
  id,
  url,
  alt,
  type: 'product' as const,
  createdAt: now,
  updatedAt: now,
})

export const makeVariants = (colorKeys: (keyof typeof colors)[], sizeKeys: (keyof typeof sizes)[]) =>
  colorKeys.flatMap((ck, ci) =>
    sizeKeys.map((sk, si) => ({
      id: `var-${ck}-${sk}`,
      color: colors[ck],
      size: sizes[sk],
      sku: `${ck.slice(0, 3).toUpperCase()}-${sk.toUpperCase()}-${ci * 10 + si}`,
      stock: Math.floor(Math.random() * 15) + 3,
    })),
  )
