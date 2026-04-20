import { Block } from 'payload'
import { properties } from '@fields'

export const CollectionGallery: Block = {
  slug: 'collectionGallery',
  interfaceName: 'CollectionGallery',
  dbName: 'collection_gallery',
  labels: {
    singular: 'Collection Gallery',
    plural: 'Collection Galleries',
  },
  imageURL: '',
  imageAltText: 'Collection gallery preview',
  fields: [
    properties({    
      paddingTop: 'XXL2',
      paddingTopMobile: 'XL2',
      paddingBottom: 'XXL2',
      paddingBottomMobile: 'XL3',
      backgroundColor: 'secondary',
      backgroundColorMobile: 'secondary',
    }),
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
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: false,
        },
      ],
    },
  ],
}
