export const parseAllowedOrigins = (): string[] => {
  const raw = process.env.PAYLOAD_CORS_ORIGINS || ''
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export const getCorsHeaders = (request: Request): HeadersInit => {
  const requestOrigin = request.headers.get('origin')
  const allowedOrigins = parseAllowedOrigins()

  const headers: Record<string, string> = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    Vary: 'Origin',
  }

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    headers['Access-Control-Allow-Origin'] = requestOrigin
  }

  return headers
}

export const isAllowedMutationOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin')
  if (!origin) return true
  return parseAllowedOrigins().includes(origin)
}

export const rejectDisallowedOrigin = (request: Request): Response | null => {
  if (isAllowedMutationOrigin(request)) return null

  return withCors(
    request,
    Response.json({ error: 'Origin is not allowed' }, { status: 403 }),
  )
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
