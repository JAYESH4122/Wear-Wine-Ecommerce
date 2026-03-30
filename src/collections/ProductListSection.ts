import { Block } from 'payload'
import { properties } from '@fields'

export const ProductListSection: Block = {
  slug: 'productListSection',
  interfaceName: 'ProductListSection',
  dbName: 'product_list_section',
  labels: {
    singular: 'Product List Section',
    plural: 'Product List Sections',
  },
  imageURL: '',
  imageAltText: 'Product list section preview',
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
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'New Arrivals',
    },
    {
      name: 'titlePrefix',
      type: 'text',
      required: true,
      defaultValue: 'Premium',
    },
    {
      name: 'titleHighlight',
      type: 'text',
      required: true,
      defaultValue: 'Collection',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: 'Explore our latest pieces designed for modern living.',
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      defaultValue: 'View All Products',
    },
    {
      name: 'limit',
      type: 'number',
      required: true,
      defaultValue: 20,
      admin: {
        description: 'Maximum number of products to fetch',
      },
    },
  ],
}
