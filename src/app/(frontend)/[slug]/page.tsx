import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RenderBlocks } from '@/app/components/RenderBlocks'

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
    },
  })

  if (!docs || docs.length === 0) {
    return notFound()
  }

  const pageInfo = docs[0]

  return (
    <main>
      <RenderBlocks blocks={pageInfo.layout || []} />
    </main>
  )
}
