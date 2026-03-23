'use client'

import { DummyTee } from 'assets'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '200+', label: 'Premium Styles' },
  { value: '15+', label: 'Countries Shipped' },
  { value: '24/7', label: 'Customer Support' },
]

const values = [
  {
    number: '01',
    title: 'Quality First',
    description:
      'Every piece is crafted with premium materials and meticulous attention to detail.',
  },
  {
    number: '02',
    title: 'Timeless Design',
    description: 'We create pieces that transcend seasons and trends, built to last.',
  },
  {
    number: '03',
    title: 'Sustainable Practice',
    description: 'Committed to ethical sourcing and environmentally conscious production.',
  },
]

export const AboutSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      {/* Premium gradient backgrounds using custom colors */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 0% 0%, #05091408, transparent 50%),
                      radial-gradient(circle at 100% 100%, #1d1b1b08, transparent 50%)`,
        }}
      />
      <div
        className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full blur-3xl pointer-events-none"
        style={{ background: `#05091408` }}
      />
      <div
        className="absolute bottom-0 left-0 w-1/4 h-1/4 rounded-full blur-3xl pointer-events-none"
        style={{ background: `#52575b08` }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            // initial={{ opacity: 0, y: 20 }}
            // whileInView={{ opacity: 1, y: 0 }}
            // viewport={{ once: true }}
            // transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#52575b]">
              About Us
            </span>
            <motion.span
              // initial={{ scaleX: 0 }}
              // whileInView={{ scaleX: 1 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 h-px origin-left"
              style={{
                background: `linear-gradient(90deg, #52575b40, transparent)`,
              }}
            />
          </motion.div>

          <motion.h2
            // initial={{ opacity: 0, y: 30 }}
            // whileInView={{ opacity: 1, y: 0 }}
            // viewport={{ once: true }}
            // transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-light tracking-tight leading-[1.1] mb-6 text-[#171717]"
          >
            Crafted for the
            <br />
            <motion.span
              // initial={{ opacity: 0, x: -20 }}
              // whileInView={{ opacity: 1, x: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6, delay: 0.3 }}
              className="relative inline-block italic text-[#52575b]"
            >
              Modern Wardrobe
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-px"
                // initial={{ scaleX: 0 }}
                // whileInView={{ scaleX: 1 }}
                // viewport={{ once: true }}
                // transition={{ duration: 0.8, delay: 0.5 }}
                style={{
                  background: `linear-gradient(90deg, #52575b80, transparent)`,
                }}
              />
            </motion.span>
          </motion.h2>

          <motion.p
            // initial={{ opacity: 0, y: 20 }}
            // whileInView={{ opacity: 1, y: 0 }}
            // viewport={{ once: true }}
            // transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg max-w-xl leading-relaxed text-[#52575b]"
          >
            We believe in the power of understated elegance. Each piece in our collection is
            thoughtfully designed to become a lasting part of your personal style.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16 md:mb-20">
          {/* Image */}
          <motion.div
            // initial={{ opacity: 0, x: -30 }}
            // whileInView={{ opacity: 1, x: 0 }}
            // viewport={{ once: true }}
            // transition={{ duration: 0.6 }}
            className="group relative aspect-[4/5] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #1d1b1b20, #05091430)`,
            }}
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0"
              // initial={{ opacity: 0, x: '-100%' }}
              // whileInView={{ opacity: 1, x: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.8 }}
              style={{
                background: `linear-gradient(45deg, #05091440, transparent)`,
              }}
            />

            {/* Image placeholder with scale effect */}
            <motion.div
              className="absolute inset-0 group-hover:scale-105 transition-transform duration-800"
              style={{
                background: `linear-gradient(135deg, #1d1b1b15, #05091420)`,
              }}
            >
              <Image src={DummyTee} alt="Dummy Tee" fill className="object-cover" />
            </motion.div>

            {/* Shimmer effect on hover */}
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              style={{
                background: `linear-gradient(90deg, transparent, #ffffff40, transparent)`,
              }}
            />

            {/* Overlay text */}
            <motion.div
              // initial={{ opacity: 0, y: 20 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-8"
              style={{
                background: `linear-gradient(to top, #050914CC, #05091480, transparent)`,
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-xs font-medium tracking-[0.2em] uppercase block mb-2 text-white/60"
              >
                Est. 2020
              </motion.span>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-lg font-light text-white"
              >
                Redefining everyday luxury
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Values */}
          <div className="flex flex-col justify-center">
            <motion.span
              // initial={{ opacity: 0 }}
              // whileInView={{ opacity: 1 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.4 }}
              className="text-xs font-medium tracking-[0.2em] uppercase mb-8 text-[#52575b]"
            >
              Our Values
            </motion.span>

            <div className="space-y-0">
              {values.map((item, idx) => (
                <motion.div
                  key={item.number}
                  // initial={{ opacity: 0, y: 20 }}
                  // whileInView={{ opacity: 1, y: 0 }}
                  // viewport={{ once: true }}
                  // transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative py-8 border-b first:border-t cursor-pointer overflow-hidden"
                  style={{ borderColor: `#52575b20` }}
                >
                  {/* Hover gradient background */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, #05091408, #1d1b1b08, transparent)`,
                    }}
                  />

                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    style={{
                      background: `linear-gradient(90deg, transparent, #1d1b1b10, transparent)`,
                    }}
                  />

                  <div className="relative flex items-start gap-6">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium tabular-nums transition-colors duration-300 group-hover:text-[#52575b]"
                      style={{ color: `#52575b60` }}
                    >
                      {item.number}
                    </motion.span>
                    <div className="flex-1">
                      <motion.h3
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                        className="text-lg font-medium mb-2 transition-colors duration-300 group-hover:text-[#1d1b1b] text-[#171717]"
                      >
                        {item.title}
                      </motion.h3>
                      <p className="text-sm leading-relaxed max-w-sm transition-colors duration-300 group-hover:text-[#171717] text-[#52575b]">
                        {item.description}
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight
                        className="w-5 h-5 transition-all duration-300 mt-1 group-hover:text-[#050914]"
                        strokeWidth={1.2}
                        style={{ color: `#52575b60` }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#our-story"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ x: 5 }}
              className="group inline-flex items-center gap-3 mt-10 text-sm font-medium tracking-wide uppercase cursor-pointer relative w-fit text-[#1d1b1b] hover:text-[#050914] transition-colors duration-200"
            >
              <span className="relative">
                Read Our Story
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-px bg-[#050914]"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ originX: 0 }}
                />
              </span>
              <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <ArrowRight
                  className="w-4 h-4 text-[#1d1b1b] group-hover:text-[#050914] transition-colors duration-200"
                  strokeWidth={1.5}
                />
              </motion.div>
            </motion.a>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          // initial={{ opacity: 0, y: 30 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // viewport={{ once: true }}
          // transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{
            background: `linear-gradient(90deg, #52575b30, #05091440, #52575b30)`,
          }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              // initial={{ opacity: 0, y: 20 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.5, delay: idx * 0.1 }}
              // whileHover={{ y: -5 }}
              className="group relative p-8 md:p-10 text-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #ffffff, #ffffffE6)`,
              }}
            >
              {/* Premium hover gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, #05091408, #1d1b1b08)`,
                }}
              />

              {/* Shimmer effect */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{
                  background: `linear-gradient(90deg, transparent, #ffffff80, transparent)`,
                }}
              />

              <div className="relative">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="block text-3xl md:text-4xl font-light tracking-tight mb-2 transition-colors duration-300 group-hover:text-[#050914] text-[#171717]"
                >
                  {stat.value}
                </motion.span>
                <span className="text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300 group-hover:text-[#1d1b1b] text-[#52575b]">
                  {stat.label}
                </span>
              </div>

              {/* Decorative corner accent */}
              <div
                className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 transition-all duration-500 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100"
                style={{
                  borderColor: `#05091430`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          // initial={{ scaleX: 0 }}
          // whileInView={{ scaleX: 1 }}
          // viewport={{ once: true }}
          // transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 md:mt-20 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, #52575b40, #05091460, #52575b40, transparent)`,
          }}
        />
      </div>
    </section>
  )
}
