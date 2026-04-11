'use client'

import { useState, useMemo } from 'react'
import { ProductBreadcrumb } from './product-breadcrumb'
import { ProductGallery } from './product-gallery'
import { ProductInfoPanel } from './product-info-panel'
import { RelatedProducts } from './related-products'
import { SizeChartModal } from './size-chart-model'
import { TermsModal } from './terms-modal'
import type { ProductDetailsProps, NormalizedColor, NormalizedSize } from './types'
import type { Category, Color, Media, Size } from '@/payload-types'

export const ProductDetails = ({ product, relatedProducts = [], pdpStatic }: ProductDetailsProps) => {
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)

  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? ((product.category as Category).name ?? null)
      : null

  const hasSale = !!product.salePrice && product.salePrice < product.price
  const discountPercentage = hasSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

  const allImages = useMemo(
    () => product.images?.map((item) => item.image as Media).filter(Boolean) ?? [],
    [product.images],
  )

  const colors = useMemo<NormalizedColor[]>(() => {
    const seen = new Set<string | number>()
    return (product.variants ?? []).reduce<NormalizedColor[]>((acc, v) => {
      if (v.color && typeof v.color === 'object' && !seen.has((v.color as Color).id)) {
        const c = v.color as Color
        seen.add(c.id)
        acc.push({ id: String(c.id), name: c.name ?? null, hex: c.hex ?? '#000000' })
      }
      return acc
    }, [])
  }, [product.variants])

  const sizes = useMemo<NormalizedSize[]>(() => {
    const seen = new Set<string | number>()
    return (product.variants ?? []).reduce<NormalizedSize[]>((acc, v) => {
      if (v.size && typeof v.size === 'object' && !seen.has((v.size as Size).id)) {
        const s = v.size as Size
        seen.add(s.id)
        acc.push({ id: String(s.id), label: s.label ?? null })
      }
      return acc
    }, [])
  }, [product.variants])

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ProductBreadcrumb category={categoryName} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16 pb-8">
          {/* Gallery — left */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={allImages}
              productName={product.name}
              hasSale={hasSale}
              discountPercentage={discountPercentage}
            />
          </div>

          {/* Info panel — right, sticky */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <ProductInfoPanel
                product={product}
                colors={colors}
                sizes={sizes}
                pdpStatic={pdpStatic}
                onOpenTerms={() => setShowTermsModal(true)}
                onOpenSizeChart={() => setShowSizeChart(true)}
              />
            </div>
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts products={relatedProducts} />
      </div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        imageUrl={typeof pdpStatic?.sizeChart?.image === 'object' ? pdpStatic.sizeChart.image?.url ?? '' : ''}
      />
    </div>
  )
}
