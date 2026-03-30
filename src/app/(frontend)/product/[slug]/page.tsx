import { notFound } from 'next/navigation'
import React from 'react'
import { ProductDetails } from '@/app/components/product-details'
import type { Product, PdpStatic } from '@/payload-types'
import { getProductBySlug, getRelatedProducts } from '@/lib/api/products'
import { getGlobal } from '@/lib/api/cms'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const [product, pdpStatic] = await Promise.all([
    getProductBySlug(slug),
    getGlobal<PdpStatic>('pdp-static'),
  ])

  if (!product || !pdpStatic) return notFound()

  const categoryId =
    product.category && typeof product.category === 'object'
      ? (product.category as any).id
      : product.category

  const relatedDocs = categoryId ? await getRelatedProducts({ categoryId, slug, limit: 4 }) : []

  return (
    <div className="min-h-screen bg-background">
      <ProductDetails
        product={product as Product}
        relatedProducts={relatedDocs as Product[]}
        pdpStatic={pdpStatic}
      />
    </div>
  )
}
