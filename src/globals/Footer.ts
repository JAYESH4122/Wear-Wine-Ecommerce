import { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [

    {
      name: 'policiesGroup',
      type: 'group',
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
              relationTo: 'policies',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
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
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'hours',
          type: 'array',
          fields: [
            {
              name: 'time',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'group',
      fields: [
        {
          name: 'year',
          type: 'text',
        },
        {
          name: 'brand',
          type: 'text',
        },
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
  ],
}
