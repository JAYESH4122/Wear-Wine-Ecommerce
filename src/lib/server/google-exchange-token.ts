import crypto from 'crypto'

type ExchangePayload = {
  sub: string
  email: string
  name?: string | null
  roles?: string[]
  isVerified?: boolean
  iat: number
  exp: number
}

const toBase64Url = (value: string): string => {
  return Buffer.from(value).toString('base64url')
}

const fromBase64Url = (value: string): string => {
  return Buffer.from(value, 'base64url').toString('utf8')
}

const getSecret = (): string => {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET is not configured')
  return secret
}

const signValue = (value: string): string => {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url')
}

const safeEquals = (a: string, b: string): boolean => {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)

  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

export const createGoogleExchangeToken = (payload: Omit<ExchangePayload, 'iat' | 'exp'>): string => {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const tokenPayload: ExchangePayload = {
    ...payload,
    iat: nowSeconds,
    exp: nowSeconds + 120,
  }

  const encodedPayload = toBase64Url(JSON.stringify(tokenPayload))
  const signature = signValue(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export const verifyGoogleExchangeToken = (token: string): ExchangePayload | null => {
  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) return null

  const expectedSignature = signValue(encodedPayload)
  if (!safeEquals(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as ExchangePayload
    const nowSeconds = Math.floor(Date.now() / 1000)

    if (!payload.sub || !payload.email || typeof payload.exp !== 'number') {
      return null
    }

    if (payload.exp <= nowSeconds) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
