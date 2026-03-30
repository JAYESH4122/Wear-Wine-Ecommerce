import { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2024 Wear Wine. All rights reserved.',
    },
    {
      name: 'columns',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'link',
              type: 'relationship',
              relationTo: 'pages',
            },
            {
              name: 'label',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
