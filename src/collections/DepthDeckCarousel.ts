import { Block } from 'payload'
import { properties } from '@fields'

export const DepthDeckCarousel: Block = {
  slug: 'depthDeckCarousel',
  interfaceName: 'DepthDeckCarousel',
  dbName: 'depth_deck_carousel',
  labels: {
    singular: 'Depth Deck Carousel',
    plural: 'Depth Deck Carousels',
  },
  imageURL: '',
  imageAltText: 'Depth deck carousel preview',
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
      name: 'cards',
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
  ],
}
