import type { CollectionBeforeValidateHook } from 'payload'

export const formatSlug = (value: string) =>
  value
    ?.toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')

export const generateSlug =
  (fieldToUse: string): CollectionBeforeValidateHook =>
  ({ data, operation }) => {
    if (operation === 'create' || operation === 'update') {
      if (data?.[fieldToUse] && !data?.slug) {
        data.slug = formatSlug(data[fieldToUse])
      }
    }
    return data
  }