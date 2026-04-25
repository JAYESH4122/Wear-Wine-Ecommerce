'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Policy } from '@/payload-types'
import { Button } from '@/components/ui/button/Button'

interface PolicyContentProps {
  policy: Policy
}

export function PolicyContent({ policy }: PolicyContentProps) {
  const isFaq = Boolean(policy.faqs?.length)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/10">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
          <Button
            asChild
            variant="back"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            className="mb-6 text-sm text-primary/60 hover:text-primary sm:mb-8"
          >
            <Link href="/">Back to Home</Link>
          </Button>

          <h1 className="break-words font-serif text-3xl font-light tracking-tight text-primary sm:text-4xl md:text-5xl">
            {policy.title}
          </h1>

          <p className="mt-4 text-xs tracking-wide text-primary/50 sm:text-sm">
            Last updated: {policy.lastUpdated}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:px-8 md:py-16">
        {isFaq ? (
          <FaqAccordion faqs={policy.faqs!} />
        ) : (
          <DocumentSections sections={policy.sections!} />
        )}
      </div>

      {/* Footer CTA */}
      <section className="border-t border-primary/10 bg-primary/[0.02]">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 md:px-8 md:py-16">
          <p className="text-sm text-primary/60">Have questions? We&apos;re here to help.</p>
          <Button
            asChild
            variant="link"
            size="sm"
            className="mt-4 border-b border-primary/30 pb-0.5 text-sm font-medium text-primary hover:border-primary"
          >
            <Link href="mailto:hello@wearwine.com">Contact Support</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

function DocumentSections({ sections }: { sections: { heading: string; content: string }[] }) {
  return (
    <div className="space-y-10 sm:space-y-12">
      {sections.map((section, index) => (
        <section key={section.heading} className="group">
          <div className="mb-3 flex items-start gap-3 sm:mb-4 sm:items-baseline sm:gap-4">
            <span className="mt-1 shrink-0 font-mono text-xs text-primary/30 sm:mt-0">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="break-words font-serif text-lg font-light text-primary sm:text-xl md:text-2xl">
              {section.heading}
            </h2>
          </div>
          <div className="ml-4 border-l border-primary/10 pl-4 sm:ml-6 sm:pl-6 md:ml-10">
            <p className="break-words text-sm leading-relaxed text-primary/70 sm:text-base">
              {section.content}
            </p>
          </div>
        </section>
      ))}
    </div>
  )
}

function FaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-primary/10">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index

        return (
          <div key={faq.question} className="py-4 sm:py-6">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              type="button"
              aria-expanded={isOpen}
              className="group flex w-full items-start justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span className="flex min-w-0 items-start gap-2 pr-2 sm:gap-4">
                <span className="mt-1 shrink-0 font-mono text-xs text-primary/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'min-w-0 break-words font-serif text-base font-light leading-snug transition-colors sm:text-lg md:text-xl',
                    isOpen ? 'text-primary' : 'text-primary/80',
                  )}
                >
                  {faq.question}
                </span>
              </span>
              <ChevronDown
                size={20}
                className={cn(
                  'mt-1 shrink-0 text-primary/40 transition-transform duration-300',
                  isOpen && 'rotate-180',
                )}
              />
            </button>

            <div
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] pt-3 sm:pt-4' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="ml-4 border-l border-primary/10 pl-4 sm:ml-6 sm:pl-6 md:ml-10">
                  <p className="break-words text-sm leading-relaxed text-primary/70 sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
