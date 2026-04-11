'use client'

import Link from 'next/link'

interface Props {
  category?: string | null
}

export const ProductBreadcrumb = ({ category }: Props) => (
  <nav
    className="py-5 text-[10px] uppercase tracking-[0.2em] text-neutral-400"
    aria-label="Breadcrumb"
  >
    <Link href="/" className="hover:text-neutral-900 transition-colors duration-200">
      Home
    </Link>
    {category && (
      <>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-neutral-900">{category}</span>
      </>
    )}
  </nav>
)
