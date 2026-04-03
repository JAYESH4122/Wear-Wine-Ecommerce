export const getApiUrl = () => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('Missing API URL')
  }
  return process.env.NEXT_PUBLIC_API_URL
}
