import { Block } from 'payload'
import { properties } from './fields/properties'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    properties({
      paddingTop: 'NONE',
      paddingBottom: 'NONE',
    }),
    {
      name: 'slides',
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
