type Variant = {
  color?: string | { id: string }
  size?: string | { id: string }
}

export const validateVariantCombination = (value: unknown) => {
  if (!Array.isArray(value)) return true

  const colorSizeMap = new Map<string, Set<string>>()

  for (const variant of value as Variant[]) {
    const color =
      typeof variant.color === 'string'
        ? variant.color
        : variant.color?.id

    const size =
      typeof variant.size === 'string'
        ? variant.size
        : variant.size?.id

    if (!color || !size) continue

    if (!colorSizeMap.has(color)) {
      colorSizeMap.set(color, new Set())
    }

    const sizes = colorSizeMap.get(color)!

    if (sizes.has(size)) {
      return 'Each size must be unique within the same color'
    }

    sizes.add(size)
  }

  return true
}