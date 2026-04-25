import { notFound } from 'next/navigation'
import { getPolicies, getPolicyBySlug } from '@/lib/api/cms'
import { PolicyContent } from './poilicy-content'
import type { Policy } from '@/payload-types'

interface PolicyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const policies = await getPolicies()
  return policies.map((p: Policy) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { slug } = await params
  const policy = await getPolicyBySlug(slug)

  if (!policy) return { title: 'Not Found' }

  return {
    title: `${policy.title} | Wear Wine`,
    description: `${policy.title} for Wear Wine - Elegance & Comfort`,
  }
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params
  const policy = await getPolicyBySlug(slug)

  if (!policy) notFound()

  return <PolicyContent policy={policy as any} />
}
