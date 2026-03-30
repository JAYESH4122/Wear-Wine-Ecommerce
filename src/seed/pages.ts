import { Payload } from 'payload'

export const seedPages = async (payload: Payload) => {
  payload.logger.info('Seeding Pages...')

  // Find media for hero, carousel, gallery
  const heroMedia = await payload.find({
    collection: 'media',
    where: { type: { equals: 'hero' } },
    limit: 5,
  })

  const carouselMedia = await payload.find({
    collection: 'media',
    where: { type: { equals: 'carousel' } },
    limit: 6,
  })

  // Home Page
  const homePage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
  })

  const pageData = {
    title: 'Home',
    slug: 'home',
    layout: [
      {
        blockType: 'hero',
        slides: heroMedia.docs.map((m) => ({ image: m.id })),
      },
      {
        blockType: 'productListSection',
        tagline: 'New Arrivals',
        titlePrefix: 'Premium',
        titleHighlight: 'Collection',
        description: 'Explore our latest pieces designed for modern living.',
        buttonText: 'View All Products',
        limit: 8,
      },
      {
        blockType: 'collectionGallery',
        images: [
          {
            image: heroMedia.docs[0]?.id,
            title: 'New Arrivals',
            label: 'Spring 2024',
            gridClass: 'col-span-12 md:col-span-8 h-[400px] md:h-[700px]',
          },
          {
            image: carouselMedia.docs[0]?.id,
            title: 'Spring Edit',
            label: 'Editorial',
            gridClass: 'md:col-span-4 h-[300px] md:h-[350px]',
          },
          {
            image: carouselMedia.docs[1]?.id,
            title: 'Essentials',
            label: 'Curated',
            gridClass: 'w-1/2 h-[300px] md:h-[350px]',
          },
          {
            image: carouselMedia.docs[2]?.id,
            title: 'Minimalist',
            label: 'Collection',
            gridClass: 'w-1/2 h-[300px] md:h-[350px]',
          },
        ],
      },
      {
        blockType: 'depthDeckCarousel',
        cards: carouselMedia.docs.map((m, i) => ({
          image: m.id,
          title: `Selection ${i + 1}`,
          description: 'Editorial Selection',
        })),
      },
      {
        blockType: 'about',
        badge: 'About Us',
        title: 'Crafted for the Modern Wardrobe',
        description:
          'We believe in the power of understated elegance. Each piece in our collection is thoughtfully designed to become a lasting part of your personal style.',
        image: heroMedia.docs[1]?.id,
        stats: [
          { value: '50K+', label: 'Happy Customers' },
          { value: '200+', label: 'Premium Styles' },
          { value: '15+', label: 'Countries Shipped' },
          { value: '24/7', label: 'Customer Support' },
        ],
        values: [
          {
            number: '01',
            title: 'Quality First',
            description: 'Every piece is crafted with premium materials.',
          },
          { number: '02', title: 'Timeless Design', description: 'Pieces that transcend seasons.' },
          { number: '03', title: 'Sustainable', description: 'Ethical sourcing.' },
        ],
      },
      {
        blockType: 'contact',
        badge: 'Get In Touch',
        title: "We're Here to Help",
        description: 'Have questions? Our team is ready to assist you.',
        methods: [
          { type: 'Email', value: 'hello@wearwine.com', href: 'mailto:hello@wearwine.com' },
          { type: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
        ],
        socialLinks: [
          { platform: 'Instagram', href: '#' },
          { platform: 'Twitter', href: '#' },
        ],
        newsletter: {
          title: 'Join Our Community',
          description: 'Subscribe for exclusive offers.',
          buttonText: 'Subscribe',
        },
      },
    ],
  }

  if (homePage.totalDocs > 0) {
    await payload.update({
      collection: 'pages',
      id: homePage.docs[0].id,
      data: pageData as any,
    })
  } else {
    await payload.create({
      collection: 'pages',
      data: pageData as any,
    })
  }

  payload.logger.info('Pages Seeded.')
}
