import crypto from 'crypto'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'

const hashRateLimitKey = (key: string): string => {
  const salt =
    process.env.RATE_LIMIT_SALT || process.env.NEXTAUTH_SECRET || process.env.PAYLOAD_SECRET

  if (!salt) {
    throw new Error('RATE_LIMIT_SALT, NEXTAUTH_SECRET, or PAYLOAD_SECRET must be configured')
  }

  return crypto.createHmac('sha256', salt).update(key).digest('hex')
}

export const checkRateLimit = async ({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}): Promise<{
  limited: boolean
  remaining: number
  resetAt: number
}> => {
  const now = Date.now()
  const nextResetAt = new Date(now + windowMs)
  const hashedKey = hashRateLimitKey(key)
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.db.pool.query<{
      count: number | string
      reset_at: Date | string
    }>(
      `
        INSERT INTO "rate_limit_buckets" ("key", "count", "reset_at")
        VALUES ($1, 1, $2)
        ON CONFLICT ("key") DO UPDATE SET
          "count" = CASE
            WHEN "rate_limit_buckets"."reset_at" <= $3 THEN 1
            ELSE "rate_limit_buckets"."count" + 1
          END,
          "reset_at" = CASE
            WHEN "rate_limit_buckets"."reset_at" <= $3 THEN $2
            ELSE "rate_limit_buckets"."reset_at"
          END
        RETURNING "count", "reset_at"
      `,
      [hashedKey, nextResetAt, new Date(now)],
    )

    const bucket = result.rows[0]
    if (!bucket) throw new Error('Rate-limit bucket was not returned')

    const count = Number(bucket.count)
    const resetAt = new Date(bucket.reset_at).getTime()

    return {
      limited: count > limit,
      remaining: Math.max(0, limit - count),
      resetAt,
    }
  } catch (error) {
    console.error('[rate-limit] Persistent rate limiter unavailable', {
      error: error instanceof Error ? error.message : 'unknown',
    })

    // Fail closed. A missing migration or database outage must not silently
    // remove abuse protection from authentication and payment endpoints.
    return {
      limited: true,
      remaining: 0,
      resetAt: now + windowMs,
    }
  }
}

export const getClientIp = (request: Request): string => {
  const forwardedFor =
    request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

export const getClientIpFromHeaderRecord = (
  headers: Record<string, unknown> | undefined,
): string => {
  const read = (name: string) => {
    const value = headers?.[name] ?? headers?.[name.toLowerCase()]
    if (Array.isArray(value)) return String(value[0] ?? '')
    return typeof value === 'string' ? value : ''
  }
  const forwardedFor = read('x-vercel-forwarded-for') || read('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown'
  return read('x-real-ip') || 'unknown'
}
