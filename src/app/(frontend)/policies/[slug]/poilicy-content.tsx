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
        <div className="mx-auto max-w-4xl px-6 py-8 md:px-8 md:py-12">
          <Button
            asChild
            variant="back"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            className="mb-8 text-sm text-primary/60 hover:text-primary"
          >
            <Link href="/">Back to Home</Link>
          </Button>

          <h1 className="font-serif text-4xl font-light tracking-tight text-primary md:text-5xl">
            {policy.title}
          </h1>

          <p className="mt-4 text-sm tracking-wide text-primary/50">
            Last updated: {policy.lastUpdated}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-16">
        {isFaq ? (
          <FaqAccordion faqs={policy.faqs!} />
        ) : (
          <DocumentSections sections={policy.sections!} />
        )}
      </div>

      {/* Footer CTA */}
      <section className="border-t border-primary/10 bg-primary/[0.02]">
        <div className="mx-auto max-w-4xl px-6 py-12 text-center md:px-8 md:py-16">
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
    <div className="space-y-12">
      {sections.map((section, index) => (
        <section key={section.heading} className="group">
          <div className="mb-4 flex items-baseline gap-4">
            <span className="font-mono text-xs text-primary/30">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="font-serif text-xl font-light text-primary md:text-2xl">
              {section.heading}
            </h2>
          </div>
          <div className="ml-10 border-l border-primary/10 pl-6">
            <p className="text-base leading-relaxed text-primary/70">{section.content}</p>
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
          <div key={faq.question} className="group">
            <Button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              variant="text"
              size="lg"
              fullWidth
              aria-expanded={isOpen}
              rightIcon={
                <ChevronDown
                  size={20}
                  className={cn(
                    'mt-1 shrink-0 text-primary/40 transition-transform duration-300',
                    isOpen && 'rotate-180',
                  )}
                />
              }
              className="items-start justify-between gap-4 py-6 text-left"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-primary/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'font-serif text-lg font-light transition-colors md:text-xl',
                    isOpen ? 'text-primary' : 'text-primary/80',
                  )}
                >
                  {faq.question}
                </span>
              </div>
            </Button>

            <div
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="ml-10 border-l border-primary/10 pl-6">
                  <p className="text-base leading-relaxed text-primary/70">{faq.answer}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
