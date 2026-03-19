'use client'

import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  ArrowUpRight,
  Headphones,
} from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@wearwine.com',
    href: 'mailto:hello@wearwine.com',
    gradient: 'from-neutral-50 to-white',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
    gradient: 'from-neutral-50 to-white',
  },
  {
    icon: Headphones,
    label: 'Live Chat',
    value: 'Available 24/7',
    href: '#chat',
    gradient: 'from-neutral-50 to-white',
  },
  {
    icon: Clock,
    label: 'Support Hours',
    value: 'Mon-Fri, 9-6 EST',
    href: '#hours',
    gradient: 'from-neutral-50 to-white',
  },
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#instagram' },
  { icon: Twitter, label: 'Twitter', href: '#twitter' },
  { icon: Linkedin, label: 'LinkedIn', href: '#linkedin' },
  { icon: Facebook, label: 'Facebook', href: '#facebook' },
]

export const ContactSection = () => {
  return (
    <section className="relative py-12 md:py-20 bg-white overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/50 via-white to-white pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-xs font-medium tracking-wider uppercase text-neutral-500 block mb-6"
          >
            Get In Touch
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 mb-6"
          >
            We&apos;re Here to Help
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed"
          >
            Have questions about your order or our collection? Our team is ready to assist you with personalized support and expert guidance.
          </motion.p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          {contactMethods.map((method, idx) => (
            <motion.a
              key={method.label}
              href={method.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-gradient-to-br from-white to-neutral-50/80 border border-neutral-200 p-6 md:p-8 hover:border-neutral-300 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Premium gradient overlays */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                initial={false}
                animate={false}
              />
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                initial={false}
                animate={false}
              />

              {/* Shimmer effect */}
              <motion.div 
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={false}
                animate={false}
              />
              
              {/* Content (relative to appear above backgrounds) */}
              <div className="relative z-10">
                <motion.div 
                  className="w-14 h-14 border border-neutral-200 group-hover:border-white/30 flex items-center justify-center mb-6 transition-all duration-500 bg-gradient-to-br from-white to-neutral-50 group-hover:from-white/10 group-hover:to-white/5"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <method.icon
                    className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors duration-500"
                    strokeWidth={1.2}
                  />
                </motion.div>

                <motion.span 
                  className="text-xs font-medium tracking-wider uppercase text-neutral-400 group-hover:text-white/70 block mb-2 transition-colors duration-500"
                >
                  {method.label}
                </motion.span>

                <motion.p 
                  className="text-base font-medium text-neutral-900 group-hover:text-white transition-colors duration-500"
                >
                  {method.value}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-2 right-2"
                >
                  <ArrowUpRight
                    className="w-5 h-5 text-neutral-900 group-hover:text-white transition-colors duration-500"
                    strokeWidth={1.2}
                  />
                </motion.div>
              </div>

              {/* Decorative corner accent */}
              <motion.div 
                className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-transparent group-hover:border-white/30 transition-all duration-700"
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border-b border-neutral-200 mb-16 md:mb-20 origin-left"
        />

        {/* Social Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs font-medium tracking-wider uppercase text-neutral-500 block mb-3">
              Follow Us
            </span>
            <p className="text-base text-neutral-900">Stay connected for updates & new arrivals</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            {socialLinks.map((social, idx) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-14 h-14 border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 hover:border-transparent flex items-center justify-center transition-all duration-300 overflow-hidden"
                aria-label={social.label}
              >
                {/* Premium hover gradient */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                  animate={false}
                />
                
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                  animate={false}
                />

                <social.icon
                  className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors duration-500 relative z-10"
                  strokeWidth={1.2}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 md:mt-20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden group"
        >
          {/* Premium gradient overlays */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            initial={false}
            animate={false}
          />
          
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, white 0%, transparent 50%), radial-gradient(circle at 70% 50%, white 0%, transparent 50%)`
            }} />
          </div>

          {/* Shimmer effect */}
          <motion.div 
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={false}
            animate={false}
          />

          <motion.div 
            className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
            initial={false}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-xs font-medium tracking-wider uppercase text-neutral-400 block mb-4"
              >
                Newsletter
              </motion.span>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight mb-3"
              >
                Join Our Community
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="text-base text-neutral-400 max-w-md leading-relaxed"
              >
                Subscribe for exclusive offers, early access, and styling inspiration.
              </motion.p>
            </div>

            <motion.a
              href="#subscribe"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              className="group/btn inline-flex items-center gap-3 bg-white text-neutral-900 text-sm font-medium tracking-wide uppercase px-12 py-5 hover:bg-neutral-50 transition-all duration-300 cursor-pointer flex-shrink-0 relative overflow-hidden"
            >
              <span className="relative z-10">Subscribe</span>
              <motion.div
                initial={{ x: -5 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <ChevronRight
                  className="w-4 h-4"
                  strokeWidth={1.5}
                />
              </motion.div>
              
              {/* Button hover effects */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-neutral-100 to-white"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
                style={{ originX: 0 }}
              />
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"
                initial={false}
                animate={false}
              />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}