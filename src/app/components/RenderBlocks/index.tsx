import React from 'react'
import { CollectionGallery } from '../collection-gallery'
import { DepthDeckCarousel } from '../depth-card-carousel'
import { ProductListSection } from '../product-list-section'
import { HeroSlider } from '../hero-slider'
import { AboutSection } from '../about-section'
import { ContactSection } from '../contact-section'

const blockComponents = {
  hero: HeroSlider,
  collectionGallery: CollectionGallery,
  depthDeckCarousel: DepthDeckCarousel,
  productListSection: ProductListSection,
  about: AboutSection,
  contact: ContactSection,
}

export const RenderBlocks: React.FC<{ blocks: any[] }> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        const BlockComponent = blockComponents[block.blockType as keyof typeof blockComponents]

        if (BlockComponent) {
          return <BlockComponent key={index} {...block} />
        }

        return <div key={index}>Block component not found: {block.blockType}</div>
      })}
    </>
  )
}
