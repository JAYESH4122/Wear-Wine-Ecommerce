import React from 'react'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/app/components/RenderBlocks'
import { getPageBySlug } from '@/lib/api/cms'

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pageInfo = await getPageBySlug(slug)
  if (!pageInfo) return notFound()

  return (
    <main>
      <RenderBlocks blocks={pageInfo.layout || []} />
    </main>
  )
}
