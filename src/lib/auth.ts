import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { UserService } from './user-service'

const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not defined`)
  return value
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await UserService.verifyCredentials(
            credentials.email,
            credentials.password
          )

          if (!user) {
            throw new Error('Invalid email or password')
          }

          // Return user object mapped for NextAuth
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            roles: user.roles,
          }
        } catch (error: unknown) {
          throw new Error(error instanceof Error ? error.message : 'Invalid email or password')
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        if (!profile.email) return false
        try {
          // Link or create user in Payload
          const payloadUser = await UserService.getOrCreateGoogleUser({
            email: profile.email,
            name: profile.name,
            sub: typeof (profile as { sub?: unknown }).sub === 'string' ? (profile as { sub: string }).sub : null,
          })
          // Mutate the user object so the JWT gets the exact database values
          user.id = payloadUser.id.toString()
          user.roles = payloadUser.roles
          return true
        } catch (_error: unknown) {
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      // Persist required payload roles and id into the JWT token
      if (user) {
        token.id = user.id
        token.roles = user.roles
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      // Make mapped database fields available in the client session
      if (token) {
        session.user.id = token.id as string
        session.user.roles = token.roles
        session.user.isVerified = token.isVerified
      }
      return session
    },
  },
  pages: {
    signIn: '/login', // Fallback, although using modals
    error: '/login', // Redirect back on error
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: requireEnv('NEXTAUTH_SECRET'),
}
