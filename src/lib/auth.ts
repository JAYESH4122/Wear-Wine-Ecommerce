import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserService } from './user-service'
import { verifyGoogleExchangeToken } from './server/google-exchange-token'

const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not defined`)
  return value
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        googleExchangeToken: { label: 'Google Exchange Token', type: 'text' },
      },
      async authorize(credentials) {
        const googleExchangeToken = credentials?.googleExchangeToken

        if (typeof googleExchangeToken === 'string' && googleExchangeToken.length > 0) {
          const payload = verifyGoogleExchangeToken(googleExchangeToken)

          if (!payload) {
            throw new Error('Invalid Google sign-in token')
          }

          return {
            id: payload.sub,
            email: payload.email,
            name: payload.name ?? payload.email.split('@')[0],
            roles: payload.roles ?? ['user'],
            isVerified: payload.isVerified ?? true,
          }
        }

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
    async signIn() {
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
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: requireEnv('NEXTAUTH_SECRET'),
}
