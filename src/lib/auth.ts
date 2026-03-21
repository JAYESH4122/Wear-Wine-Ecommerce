import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { UserService } from './user-service'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
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
        } catch (error: any) {
          throw new Error(error.message || 'Invalid email or password')
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          // Link or create user in Payload
          const payloadUser = await UserService.getOrCreateGoogleUser(profile)
          // Mutate the user object so the JWT gets the exact database values
          user.id = payloadUser.id.toString()
          ;(user as any).roles = payloadUser.roles
          return true
        } catch (error) {
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      // Persist required payload roles and id into the JWT token
      if (user) {
        token.id = user.id
        token.roles = (user as any).roles
        token.isVerified = (user as any).isVerified
      }
      return token
    },
    async session({ session, token }) {
      // Make mapped database fields available in the client session
      if (token) {
        if (!session.user) session.user = {}
        ;(session.user as any).id = token.id as string
        ;(session.user as any).roles = token.roles as string[]
        ;(session.user as any).isVerified = token.isVerified as boolean
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
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
}
