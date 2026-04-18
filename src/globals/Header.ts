import { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'radio',
          options: [
            { label: 'Page Link', value: 'page' },
            { label: 'Section Scroll', value: 'section' },
          ],
          defaultValue: 'page',
        },
        {
          name: 'link',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_, siblingData) => siblingData.type === 'page' || !siblingData.type,
          },
        },
        {
          name: 'section',
          type: 'select',
          options: [
            { label: 'Hero Slider', value: 'hero' },
            { label: 'Collection Gallery', value: 'collectionGallery' },
            { label: 'Depth Deck Carousel', value: 'depthDeckCarousel' },
            { label: 'Product List', value: 'productListSection' },
            { label: 'Contact', value: 'contact' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData.type === 'section',
          },
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
  ],
}
