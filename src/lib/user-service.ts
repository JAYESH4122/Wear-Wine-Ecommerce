import { getApiUrl } from '@/lib/api/getApiUrl'
import type { User } from '@/payload-types'

export const UserService = {
  async verifyCredentials(email: string, passwordString: string): Promise<User> {
    const API_URL = getApiUrl()

    const res = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password: passwordString }),
    })

    if (!res.ok) {
      const errorData = (await res.json().catch(() => null)) as
        | {
            errors?: Array<{ message?: string }>
            message?: string
          }
        | null

      throw new Error(errorData?.errors?.[0]?.message || errorData?.message || 'Invalid email or password')
    }

    const data = (await res.json()) as { user?: User }
    if (!data?.user) throw new Error('Invalid email or password')
    return data.user
  },
}
