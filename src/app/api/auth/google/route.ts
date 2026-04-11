import crypto from 'crypto'

import { OAuth2Client } from 'google-auth-library'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { createGoogleExchangeToken } from '@/lib/server/google-exchange-token'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { withCors } from '@/lib/server/cors'

const GOOGLE_AUDIENCE = process.env.GOOGLE_CLIENT_ID

const googleClient = GOOGLE_AUDIENCE ? new OAuth2Client(GOOGLE_AUDIENCE) : null

const buildError = (request: Request, message: string, status: number): Response => {
  return withCors(
    request,
    Response.json(
      {
        error: message,
      },
      { status },
    ),
  )
}

export const OPTIONS = async (request: Request) => {
  return withCors(request, new Response(null, { status: 204 }))
}

export const POST = async (request: Request): Promise<Response> => {
  if (!GOOGLE_AUDIENCE || !googleClient) {
    return buildError(request, 'Google OAuth is not configured', 500)
  }

  const ip = getClientIp(request)
  const rate = checkRateLimit({
    key: `auth-google:${ip}`,
    limit: 20,
    windowMs: 15 * 60 * 1000,
  })

  if (rate.limited) {
    return buildError(request, 'Too many requests', 429)
  }

  const body = (await request.json().catch(() => null)) as { credential?: unknown } | null
  const credential = typeof body?.credential === 'string' ? body.credential : ''

  if (!credential) {
    return buildError(request, 'Missing Google credential', 400)
  }

  let verifiedEmail = ''
  let verifiedName: string | null = null
  let verifiedSub = ''
  let emailVerified = false

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_AUDIENCE,
    })

    const payload = ticket.getPayload()

    verifiedEmail = payload?.email || ''
    verifiedName = payload?.name || null
    verifiedSub = payload?.sub || ''
    emailVerified = Boolean(payload?.email_verified)
  } catch {
    return buildError(request, 'Invalid Google token', 401)
  }

  if (!verifiedSub || !verifiedEmail || !emailVerified) {
    return buildError(request, 'Google account is missing a verified email', 401)
  }

  const payload = await getPayload({ config: configPromise })

  const existing = await payload.find({
    collection: 'users',
    where: {
      or: [
        {
          googleId: {
            equals: verifiedSub,
          },
        },
        {
          email: {
            equals: verifiedEmail,
          },
        },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  let user = existing.docs[0]

  if (!user) {
    user = await payload.create({
      collection: 'users',
      data: {
        email: verifiedEmail,
        name: verifiedName || verifiedEmail.split('@')[0] || 'Google User',
        googleId: verifiedSub,
        isVerified: true,
        roles: ['user'],
        password: crypto.randomBytes(32).toString('hex'),
      },
      overrideAccess: true,
    })
  } else if (!user.googleId || user.googleId !== verifiedSub) {
    user = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        googleId: verifiedSub,
        isVerified: true,
      },
      overrideAccess: true,
    })
  }

  const exchangeToken = createGoogleExchangeToken({
    sub: String(user.id),
    email: user.email,
    name: user.name || null,
    roles: user.roles || ['user'],
    isVerified: Boolean(user.isVerified),
  })

  return withCors(
    request,
    Response.json({
      exchangeToken,
      user: {
        id: String(user.id),
        email: user.email,
        name: user.name || null,
        roles: user.roles || ['user'],
        isVerified: Boolean(user.isVerified),
      },
    }),
  )
}
