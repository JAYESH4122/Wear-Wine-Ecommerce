import { notFound } from 'next/navigation'
import { policyPages } from '@/app/components/footer/data'
import { PolicyContent } from './poilicy-content'


interface PolicyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(policyPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { slug } = await params
  const policy = policyPages[slug]

  if (!policy) return { title: 'Not Found' }

  return {
    title: `${policy.title} | Wear Wine`,
    description: `${policy.title} for Wear Wine - Elegance & Comfort`,
  }
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params
  const policy = policyPages[slug]

  if (!policy) notFound()

  return <PolicyContent policy={policy} />
}
