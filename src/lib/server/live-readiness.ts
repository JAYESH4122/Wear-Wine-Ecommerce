import type { Payload } from 'payload'

type LiveBusinessContent = {
  administratorCount: number
  footer: unknown
  policies: unknown[]
}

const PLACEHOLDER_MARKERS = [
  '+1 (555) 123-4567',
  'wa.me/15551234567',
  'paypal',
  'apple pay',
  'over 50 countries',
  'complimentary gift wrapping on all orders',
  'free standard shipping on all orders over ₹100',
]

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

export const inspectLiveBusinessContent = ({
  administratorCount,
  footer,
  policies,
}: LiveBusinessContent) => {
  const issues: string[] = []
  const footerRecord = asRecord(footer)
  const contact = asRecord(footerRecord.contact)
  const email = typeof contact.email === 'string' ? contact.email.trim() : ''
  const phone = typeof contact.phone === 'string' ? contact.phone.trim() : ''
  const policyRecords = policies.map(asRecord)
  const policySlugs = new Set(
    policyRecords
      .map((policy) => (typeof policy.slug === 'string' ? policy.slug : ''))
      .filter(Boolean),
  )
  const publishedContent = JSON.stringify({ footer, policies }).toLowerCase()

  if (administratorCount < 1) issues.push('At least one administrator is required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    issues.push('A real support email must be published in the footer')
  }
  if (phone.replace(/\D/g, '').length < 10) {
    issues.push('A real support phone number must be published in the footer')
  }

  for (const slug of ['privacy-policy', 'terms', 'shipping']) {
    if (!policySlugs.has(slug)) issues.push(`Required policy "${slug}" is missing`)
  }
  if (!publishedContent.includes('refund')) issues.push('Refund terms must be published')
  if (!publishedContent.includes('cancel')) issues.push('Cancellation terms must be published')

  for (const marker of PLACEHOLDER_MARKERS) {
    if (publishedContent.includes(marker)) {
      issues.push(`Placeholder or unverified business claim remains: "${marker}"`)
    }
  }

  return issues
}

export const assertLiveBusinessReadiness = async (payload: Payload) => {
  // These reads intentionally bypass public access because this is an internal launch gate.
  const [administrators, footer, policies] = await Promise.all([
    payload.find({
      collection: 'users',
      where: { roles: { contains: 'admin' } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
    payload.findGlobal({
      slug: 'footer',
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'policies',
      limit: 100,
      depth: 0,
      overrideAccess: true,
    }),
  ])

  const issues = inspectLiveBusinessContent({
    administratorCount: administrators.totalDocs,
    footer,
    policies: policies.docs,
  })
  if (issues.length > 0) {
    throw new Error(`Live business readiness failed: ${issues.join('; ')}`)
  }
}
