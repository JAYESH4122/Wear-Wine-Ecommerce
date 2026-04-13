export const getApiUrl = (): string => {
  // If NEXT_PUBLIC_API_URL is set, use it (supports cross-origin deployments).
  // If it is empty or missing, return '' so all fetch() calls use relative URLs
  // — this is the safest default when the frontend and API are on the same origin.
  const url = process.env.NEXT_PUBLIC_API_URL ?? ''
  // Strip trailing slash to avoid double-slash in paths like `${url}/api/...`
  return url.replace(/\/$/, '')
}
