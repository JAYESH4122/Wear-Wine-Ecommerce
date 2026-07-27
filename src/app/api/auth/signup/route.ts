import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { withCors } from '@/lib/server/cors'

const invalidBody = (request: Request, message: string) =>
  withCors(request, Response.json({ error: message }, { status: 400 }))

const tooManyRequests = (request: Request) =>
  withCors(request, Response.json({ error: 'Too many requests' }, { status: 429 }))

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const OPTIONS = async (request: Request) => {
  return withCors(request, new Response(null, { status: 204 }))
}

export const POST = async (request: Request): Promise<Response> => {
  const ip = getClientIp(request)
  const rate = checkRateLimit({
    key: `auth-signup:${ip}`,
    limit: 20,
    windowMs: 15 * 60 * 1000,
  })

  if (rate.limited) return tooManyRequests(request)

  const body = (await request.json().catch(() => null)) as
    | {
        email?: unknown
        password?: unknown
        name?: unknown
      }
    | null

  if (!body) return invalidBody(request, 'Invalid request body')

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''

  if (!email || !isValidEmail(email)) return invalidBody(request, 'A valid email is required')
  if (!password || password.length < 6) return invalidBody(request, 'Password must be at least 6 characters')
  if (!name) return invalidBody(request, 'Name is required')

  const payload = await getPayload({ config: configPromise })

  const existing = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    return invalidBody(request, 'Email is already registered')
  }

  const user = await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      name,
      roles: ['user'],
      isVerified: true,
      _verified: true,
    },
    overrideAccess: true,
  })

  return withCors(
    request,
    Response.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      {
        status: 201,
      },
    ),
  )
}
