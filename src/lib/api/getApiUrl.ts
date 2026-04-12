export const getApiUrl = () => {
  // In the browser, always prefer same-origin API calls so auth cookies/session
  // remain attached in production deployments.
  if (typeof window !== 'undefined') {
    return ''
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!apiUrl) throw new Error('Missing API URL')

  return apiUrl.replace(/\/+$/, '')
}
