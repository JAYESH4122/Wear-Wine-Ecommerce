const parseAllowedOrigins = (): string[] => {
  const raw = process.env.PAYLOAD_CORS_ORIGINS || ''
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export const getCorsHeaders = (request: Request): HeadersInit => {
  const requestOrigin = request.headers.get('origin')
  const allowedOrigins = parseAllowedOrigins()

  let allowOrigin = ''
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    allowOrigin = requestOrigin
  } else if (allowedOrigins.length > 0) {
    allowOrigin = allowedOrigins[0] as string
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    Vary: 'Origin',
  }
}

export const withCors = (request: Request, response: Response): Response => {
  const headers = new Headers(response.headers)
  const corsHeaders = getCorsHeaders(request)

  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, String(value))
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
