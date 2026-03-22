import { notFound } from 'next/navigation'
import React from 'react'
import { ProductDetails } from '@/app/components/product-details'
import { getProductBySlug, products } from '@/data/products'
import type { Product } from '@/types'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug?: string | string[] }>
}) {
  const resolvedParams = await params
  const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug[0] : resolvedParams.slug
  if (!slug) return notFound()

  const product = getProductBySlug(slug)
  if (!product) return notFound()

  const relatedDocs: Product[] = products
    .filter((p) => p.category.id === product.category.id && p.slug !== product.slug)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <ProductDetails product={product} relatedProducts={relatedDocs} />
    </div>
  )
}
