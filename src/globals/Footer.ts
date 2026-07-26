import { GlobalConfig } from 'payload'
import { revalidateGlobalCache } from '@/lib/cache-tags'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [() => revalidateGlobalCache('footer')],
  },
  fields: [

    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
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
