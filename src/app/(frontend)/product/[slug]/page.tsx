import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductDetails } from '@/app/components/product-details'
import { RelatedProducts } from '@/app/components/product-details/related-products'
import type { Category, Product, PdpStatic } from '@/payload-types'
import { getProductBySlug, getRelatedProducts } from '@/lib/api/products'
import { getGlobal } from '@/lib/api/cms'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

const RelatedProductsFallback = () => (
  <section className="py-16 md:py-24 border-t border-neutral-100" aria-hidden="true">
    <div className="mb-8 space-y-2">
      <div className="h-3 w-24 bg-neutral-100 animate-pulse" />
      <div className="h-8 w-48 bg-neutral-100 animate-pulse" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
      ))}
    </div>
  </section>
)

const RelatedProductsBlock = async ({
  categoryId,
  slug,
}: {
  categoryId: number | string
  slug: string
}) => {
  const relatedProducts = await getRelatedProducts({ categoryId, slug, limit: 4 })
  return <RelatedProducts products={relatedProducts} />
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
      ? (product.category as Category).id
      : product.category

  return (
    <div className="min-h-screen bg-background">
      <ProductDetails product={product as Product} pdpStatic={pdpStatic} />
      {categoryId && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<RelatedProductsFallback />}>
            <RelatedProductsBlock categoryId={categoryId} slug={slug} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
