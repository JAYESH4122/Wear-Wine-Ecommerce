import React from 'react'
import { CollectionGallery } from '../collection-gallery'
import { DepthDeckCarousel } from '../depth-card-carousel'
import { ProductListSection } from '../product-list-section'
import { HeroSlider } from '../hero-slider'
import { ContactSection } from '../contact-section'

const blockComponents = {
  hero: HeroSlider,
  collectionGallery: CollectionGallery,
  depthDeckCarousel: DepthDeckCarousel,
  productListSection: ProductListSection,
  contact: ContactSection,
}

type Block = NonNullable<import('@/payload-types').Page['layout']>[number]

export const RenderBlocks: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        const blockType = block.blockType as keyof typeof blockComponents | undefined
        const BlockComponent = blockType ? blockComponents[blockType] : undefined

        if (BlockComponent) {
          const Component = BlockComponent as unknown as React.ComponentType<Record<string, unknown>>
          return (
            <section id={String(blockType)} key={index}>
              <Component {...(block as unknown as Record<string, unknown>)} />
            </section>
          )
        }

        return <div key={index}>Block component not found: {String(blockType)}</div>
      })}
    </>
  )
}
