'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { collectionGalleryData as defaultImages } from '@/data/collections'

interface GalleryImage {
  id: number
  src: string
  title: string
  label: string
  gridClass: string
}

const ImageCard = ({ image, index }: { image: GalleryImage; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative bg-neutral-50 overflow-hidden cursor-pointer ${image.gridClass}`}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <Image
          src={image.src}
          alt={image.title}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Subtle dark overlay at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content - Always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <p className="text-xs font-medium tracking-wider uppercase text-white/70 mb-1">
          {image.label}
        </p>
        <h3 className="text-base md:text-lg font-medium text-white tracking-tight">
          {image.title}
        </h3>
      </div>
    </motion.div>
  )
}

export const CollectionGallery = ({ images = defaultImages }) => {
  return (
    <section className="bg-background  py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium tracking-wider uppercase text-neutral-500 mb-3"
            >
              Selected Works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900"
            >
              Premium Collection
            </motion.h2>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[160px]">
          {images.map((img, idx) => (
            <ImageCard key={img.id} image={img} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CollectionGallery
