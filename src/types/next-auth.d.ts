import type { DefaultSession, DefaultUser } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string
      roles?: string[]
      isVerified?: boolean
    }
  }

  interface User extends DefaultUser {
    id: string
    roles?: string[]
    isVerified?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string
    roles?: string[]
    isVerified?: boolean
  }
}

