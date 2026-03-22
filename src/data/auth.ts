import type { AuthProvider, User } from '@/types'

export const authStorageKey = 'wear-wine:user'

export const authProviders: Record<AuthProvider, Pick<User, 'email' | 'name'>> = {
  google: { email: 'google.user@wearwine.local', name: 'Google User' },
}

export const createUserFromProvider = (provider: AuthProvider): User => {
  const profile = authProviders[provider]
  return {
    id: `${authStorageKey}:${provider}`,
    email: profile.email,
    name: profile.name,
    isVerified: true,
  }
}

