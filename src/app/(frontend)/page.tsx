import React from 'react'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/app/components/RenderBlocks'
import { getPageBySlug } from '@/lib/api/cms'
import './styles.css'

export const HomePage = async () => {
  const pageInfo = await getPageBySlug('home')

  if (!pageInfo) return notFound()

  return (
    <>
      <RenderBlocks blocks={pageInfo.layout || []} />
    </>
  )
}

export default HomePage

