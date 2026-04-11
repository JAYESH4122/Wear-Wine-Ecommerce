type RateLimitBucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitBucket>()

export const checkRateLimit = ({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}) => {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return {
      limited: false,
      remaining: limit - 1,
      resetAt: now + windowMs,
    }
  }

  if (existing.count >= limit) {
    return {
      limited: true,
      remaining: 0,
      resetAt: existing.resetAt,
    }
  }

  existing.count += 1
  buckets.set(key, existing)

  return {
    limited: false,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  }
}

export const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') || 'unknown'
}
