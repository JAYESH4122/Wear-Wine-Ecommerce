import { DATA_SOURCE } from '@/config/data-source'
import { categoriesData } from '@/data/categories'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { CategoryItem } from '@/app/components/Header/data'

export const getHeaderCategories = async (): Promise<CategoryItem[]> => {
  if (DATA_SOURCE === 'local') {
    return categoriesData.map(cat => ({
      name: cat.name,
      href: `/category/${cat.slug}`,
      count: 0 // Mock count
    }))
  }

  // EXISTING CMS LOGIC
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { docs: categories } = await payload.find({
      collection: 'categories',
      limit: 100,
    })

    const items = await Promise.all(
      categories.map(async (category) => {
        const { totalDocs } = await payload.find({
          collection: 'products',
          where: { category: { equals: category.id } },
          limit: 0,
        })
        return {
          name: category.name,
          href: `/category/${category.slug}`,
          count: totalDocs,
        }
      }),
    )

    return items
  } catch (error) {
    console.error('Failed to fetch header categories from CMS:', error)
    return categoriesData.map(cat => ({
      name: cat.name,
      href: `/category/${cat.slug}`,
      count: 0
    }))
  }
}
