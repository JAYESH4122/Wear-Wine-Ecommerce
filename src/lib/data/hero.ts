import { DATA_SOURCE } from '@/config/data-source'
import { heroData } from '@/data/hero'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'

export const getHeroData = async (): Promise<Media[]> => {
  if (DATA_SOURCE === 'local') {
    return heroData
  }

  // EXISTING CMS LOGIC
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'media',
      where: {
        type: { equals: 'hero' },
      },
      limit: 30,
    })
    return docs
  } catch (error) {
    console.error('Failed to fetch hero data from CMS:', error)
    return heroData // Fallback to local
  }
}
