import type { CollectionConfig } from 'payload'
import { formatSlug } from './lib'
import { validateVariantCombination } from './validation'


type Variant = {
  color?: string | { id: string }
  size?: string | { id: string }
}

export const Products: CollectionConfig = {
  slug: 'products',

  admin: {
    useAsTitle: 'name',
  },

  access: {
    read: () => true,
  },

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data?.slug) {
          data.slug = formatSlug(data.name)
        }
        return data
      },
    ],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },

    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'salePrice',
      type: 'number',
      min: 0,
    },

{
  name: 'variants',
  type: 'array',
  validate: validateVariantCombination,
  fields: [
    {
      name: 'color',
      type: 'relationship',
      relationTo: 'colors',
      required: true,
    },
    {
      name: 'size',
      type: 'relationship',
      relationTo: 'sizes',
      required: true,
    },
    {
      name: 'sku',
      type: 'text',
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
  ],
}
  ],
}