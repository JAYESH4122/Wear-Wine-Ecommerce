import { CollectionConfig } from 'payload'
import { CollectionGallery } from './CollectionGallery'
import { DepthDeckCarousel } from './DepthDeckCarousel'
import { ProductListSection } from './ProductListSection'
import { Hero } from './Hero'
import { Contact } from './Contact'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) {
              return data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }
            return value
          }
        ]
      }
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [
        Hero,
        CollectionGallery,
        DepthDeckCarousel,
        ProductListSection,
        Contact,
      ],
    },
  ],
}
