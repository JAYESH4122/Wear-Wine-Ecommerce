import { Block } from 'payload'
import { properties } from './fields/properties'

export const About: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  fields: [
    properties({
      paddingTop: 'XL2',
      paddingBottom: 'XL2',
      backgroundColor: 'primary',
    }),
    {
      name: 'badge',
      type: 'text',
      required: true,
      defaultValue: 'About Us',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'values',
      type: 'array',
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
