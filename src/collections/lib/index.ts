export const formatSlug = (value: string) =>
  value
    ?.toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')