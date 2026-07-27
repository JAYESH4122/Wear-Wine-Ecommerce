import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { authOptions } from '@/lib/auth'
import { requirePayloadUser } from '@/lib/server/commerce'
import { withCors } from '@/lib/server/cors'

const unauthorized = (request: Request) =>
  withCors(request, Response.json({ error: 'Unauthorized' }, { status: 401 }))

const invalidBody = (request: Request, message: string) =>
  withCors(request, Response.json({ error: message }, { status: 400 }))

export const OPTIONS = async (request: Request) => {
  return withCors(request, new Response(null, { status: 204 }))
}

export const PATCH = async (request: Request): Promise<Response> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized(request)

  const body = (await request.json().catch(() => null)) as { name?: unknown } | null
  if (!body) return invalidBody(request, 'Invalid request body')

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) return invalidBody(request, 'Name is required')
  if (name.length > 120) return invalidBody(request, 'Name must be 120 characters or less')

  const payload = await getPayload({ config: configPromise })
  const payloadUser = await requirePayloadUser(payload, session.user.id)
  if (!payloadUser) return unauthorized(request)

  const updated = await payload.update({
    collection: 'users',
    id: payloadUser.id,
    data: {
      name,
    },
    user: payloadUser,
    overrideAccess: false,
  })

  return withCors(
    request,
    Response.json({
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        isVerified: updated.isVerified,
      },
    }),
  )
}
