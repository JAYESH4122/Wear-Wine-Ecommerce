import { getApiUrl } from '@/lib/api/getApiUrl'
import type { User } from '@/payload-types'

export const UserService = {
  async getUserByEmail(email: string): Promise<User | null> {
    const API_URL = getApiUrl()

    const params = new URLSearchParams({ limit: '1', depth: '0' })
    params.set('where[email][equals]', email)

    const res = await fetch(`${API_URL}/api/users?${params.toString()}`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    const data = (await res.json()) as { docs?: User[] }
    return data?.docs?.[0] ?? null
  },

  async getOrCreateGoogleUser(profile: {
    email: string
    name?: string | null
    sub?: string | null
  }): Promise<User> {
    const API_URL = getApiUrl()

    const existingUser = await this.getUserByEmail(profile.email)
    if (existingUser) return existingUser

    const res = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: profile.email,
        name: profile.name ?? profile.email.split('@')[0],
        googleId: profile.sub ?? undefined,
        password: Math.random().toString(36).slice(-12),
        roles: ['user'],
        isVerified: true,
      }),
    })

    if (!res.ok) {
      const message = await res.text().catch(() => '')
      throw new Error(`Failed to create user: ${res.status} ${message}`)
    }
    return (await res.json()) as User
  },

  async verifyCredentials(email: string, passwordString: string): Promise<User> {
    const API_URL = getApiUrl()

    const res = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password: passwordString }),
    })

    if (!res.ok) {
      throw new Error('Invalid email or password')
    }

    const data = (await res.json()) as { user?: User }
    if (!data?.user) throw new Error('Invalid email or password')
    return data.user
  },
}
