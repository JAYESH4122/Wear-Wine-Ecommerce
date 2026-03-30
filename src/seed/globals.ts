import { Payload } from 'payload'
import { pdpStaticData } from '../data/pdp-static'
import { safeUploadImage } from './utils'

export const seedGlobals = async (payload: Payload) => {
  payload.logger.info('Seeding Globals...')

  // Header
  await payload.updateGlobal({
    slug: 'header',
    data: {
      announcementBar: {
        text: 'FREE SHIPPING ON ALL ORDERS OVER $100',
        isActive: true,
      },
      navItems: [
        { label: 'Shop All', link: null },
        { label: 'New Arrivals', link: null },
        { label: 'Collections', link: null },
      ],
    },
  })

  // Footer
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      copyright: '© 2026 Wear Wine. All rights reserved.',
      columns: [
        {
          title: 'Shop',
          links: [
            { label: 'All Products', link: null },
            { label: 'Featured', link: null },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About Us', link: null },
            { label: 'Contact', link: null },
          ],
        },
      ],
    },
  })

  // PDPStatic
  try {
    const sizeChartMedia = await safeUploadImage({
      payload,
      url: pdpStaticData.sizeChart.url,
      alt: pdpStaticData.sizeChart.alt,
      type: 'product',
      filename: 'size-chart.png',
      mimetype: 'image/png',
    })

    await payload.updateGlobal({
      slug: 'pdp-static',
      data: {
        shipping: pdpStaticData.shipping,
        returns: pdpStaticData.returns,
        trustBadges: pdpStaticData.trustBadges,
        sizeGuide: pdpStaticData.sizeGuide,
        sizeChart: {
          image: sizeChartMedia?.id || (await safeUploadImage({
            payload,
            url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
            alt: 'Default Size Chart',
            type: 'product',
          }))?.id as any,
          description: pdpStaticData.sizeChart.description,
        },
        cta: pdpStaticData.cta,
        accordions: pdpStaticData.accordions.map((a: any) => ({
          title: a.title,
          content: a.content,
        })),
      },
    })
  } catch (error) {
    payload.logger.error(`Failed to seed PDPStatic: ${error instanceof Error ? error.message : String(error)}`)
  }

  // Site Settings
  // Create logo media
  const logoMedia = await safeUploadImage({
    payload,
    url: 'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.png',
    alt: 'Wear Wine Logo',
    type: 'hero',
    filename: 'logo.png',
    mimetype: 'image/png',
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Wear Wine',
      logo: logoMedia?.id || (await safeUploadImage({
        payload,
        url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
        alt: 'Default Logo',
        type: 'hero',
      }))?.id as any,
      seo: {
        title: 'Wear Wine | Premium Streetwear',
        description: 'Curated premium streetwear for the modern aesthetic.',
      },
      socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/wearwine' },
        { platform: 'Twitter', url: 'https://twitter.com/wearwine' },
        { platform: 'Facebook', url: 'https://facebook.com/wearwine' },
      ],
    },
  })

  payload.logger.info('Globals Seeded.')
}
