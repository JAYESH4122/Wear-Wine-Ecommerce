import { Payload } from 'payload'
import { pdpStaticData } from '../data/pdp-static'
import { safeUploadImage } from './utils'
import { policyPages, footerData } from './footerData'

export const seedGlobals = async (payload: Payload) => {
  payload.logger.info('Seeding Globals...')

  // Header
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { label: 'Shop All', link: null },
        { label: 'New Arrivals', link: null },
        { label: 'Collections', link: null },
      ],
    },
  })

  // Policies seeding
  payload.logger.info('Seeding Policies...')
  const policyDocs: Record<string, string | number> = {}
  for (const [key, val] of Object.entries(policyPages)) {
    const existing = await payload.find({
      collection: 'policies',
      where: {
        slug: {
          equals: val.slug,
        },
      },
      limit: 1,
      depth: 0,
    })

    const policyData = {
      title: val.title,
      slug: val.slug,
      lastUpdated: val.lastUpdated,
      sections: val.sections || [],
      faqs: val.faqs || [],
    }

    const doc =
      existing.docs.length > 0
        ? await payload.update({
            collection: 'policies',
            id: existing.docs[0].id,
            data: policyData,
          })
        : await payload.create({
            collection: 'policies',
            data: policyData,
          })
    policyDocs[key] = doc.id
  }

  // Footer
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      copyright: footerData.copyright,
      contact: {
        title: footerData.contact.title,
        email: footerData.contact.email,
        phone: footerData.contact.phone,
        hours: footerData.contact.hours.map(h => ({ time: h })),
      },
      socials: footerData.socials,

      policiesGroup: {
        title: footerData.policies.title,
        links: footerData.policies.links.map(link => {
          const linkSlug = link.href.split('/').pop() || ''
          const mappedKey = Object.keys(policyPages).find(k => policyPages[k].slug === linkSlug) || linkSlug
          return {
            link: policyDocs[mappedKey] as number,
            label: link.label,
          }
        }),
      },
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
          image: (sizeChartMedia?.id ||
            (
              await safeUploadImage({
                payload,
                url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=70&fm=webp',
                alt: 'Default Size Chart',
                type: 'product',
              })
            )?.id) as unknown as number,
          description: pdpStaticData.sizeChart.description,
        },
        cta: {
          ...pdpStaticData.cta,
          alreadyInCart: pdpStaticData.cta.alreadyInCart || 'Already in Bag',
        },
        accordions: pdpStaticData.accordions.map((a) => ({
          title: a.title,
          content: a.content,
        })),
      },
    })
  } catch (error) {
    payload.logger.error(
      `Failed to seed PDPStatic: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Wear Wine',
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
