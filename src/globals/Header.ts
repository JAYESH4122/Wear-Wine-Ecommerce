import { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'announcementBar',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'navItems',
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
}
