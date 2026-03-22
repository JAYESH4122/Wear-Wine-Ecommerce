import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import React from 'react'
import { ProductDetails } from '@/app/components/product-details'
import type { Product } from '@/payload-types'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  if (!products.length) return notFound()

  const product = products[0] as Product

  const categoryId =
    product.category && typeof product.category === 'object'
      ? (product.category as any).id
      : product.category

  const { docs: relatedDocs } = await (categoryId
    ? payload.find({
        collection: 'products',
        where: {
          and: [{ category: { equals: categoryId } }, { slug: { not_equals: slug } }],
        },
        depth: 1,
        limit: 4,
      })
    : Promise.resolve({ docs: [] }))

  return (
    <div className="min-h-screen bg-background">
      <ProductDetails product={product} relatedProducts={relatedDocs as Product[]} />
    </div>
  )
}
