import { revalidateTag } from 'next/cache'

export const getGlobalCacheTag = (slug: string) => `payload-global:${slug}`

/** Clear the frontend cache immediately after a Payload global is edited. */
export const revalidateGlobalCache = (slug: string) => {
  revalidateTag(getGlobalCacheTag(slug), { expire: 0 })
}
