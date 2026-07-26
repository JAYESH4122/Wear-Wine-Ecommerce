import { withAuth } from 'next-auth/middleware'
import { NextResponse, type NextRequest } from 'next/server'

const protectedPathPrefixes = ['/account', '/checkout', '/orders']

const buildContentSecurityPolicy = (nonce: string) => {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://checkout.razorpay.com https://*.razorpay.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.razorpay.com https://*.razorpay.com",
    "frame-src https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",
    "child-src https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",
    "form-action 'self' https://api.razorpay.com https://*.razorpay.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

export default withAuth(
  function proxy(request: NextRequest) {
    const nonce = btoa(crypto.randomUUID())
    const contentSecurityPolicy = buildContentSecurityPolicy(nonce)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    requestHeaders.set('Content-Security-Policy', contentSecurityPolicy)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    const headerName =
      process.env.CSP_ENFORCE === 'true'
        ? 'Content-Security-Policy'
        : 'Content-Security-Policy-Report-Only'
    response.headers.set(headerName, contentSecurityPolicy)
    return response
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isProtected = protectedPathPrefixes.some(
          (prefix) => req.nextUrl.pathname === prefix || req.nextUrl.pathname.startsWith(`${prefix}/`),
        )
        return !isProtected || Boolean(token)
      },
    },
  },
)

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
