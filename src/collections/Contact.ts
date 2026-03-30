import { Block } from 'payload'
import { properties } from './fields/properties'

export const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
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
      defaultValue: 'Get In Touch',
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
      name: 'methods',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: ['Email', 'Phone', 'Live Chat', 'Support Hours'],
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook'],
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Join Our Community',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          defaultValue: 'Subscribe for exclusive offers, early access, and styling inspiration.',
        },
        {
          name: 'buttonText',
          type: 'text',
          required: true,
          defaultValue: 'Subscribe',
        },
      ],
    },
  ],
}
