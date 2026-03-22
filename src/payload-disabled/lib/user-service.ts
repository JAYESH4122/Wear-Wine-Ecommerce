import { getPayloadClient } from './payload-client'

export const UserService = {
  async getUserByEmail(email: string) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true, // We are running this securely on the server
    })
    return docs[0] || null
  },

  async getOrCreateGoogleUser(profile: any) {
    const payload = await getPayloadClient()
    const existingUser = await this.getUserByEmail(profile.email)

    if (existingUser) {
      // Link account if Google ID isn't set yet but email exists
      if (!existingUser.googleId) {
        await payload.update({
          collection: 'users',
          id: existingUser.id,
          data: {
            googleId: profile.sub,
            isVerified: true, // Google emails are already verified
          },
          overrideAccess: true,
        })
      }
      return existingUser
    }

    // Create new user via Google
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: profile.email,
        name: profile.name,
        googleId: profile.sub,
        password: Math.random().toString(36).slice(-12), // Dummy secure password for OAuth-only
        roles: ['user'],
        isVerified: true,
      },
      overrideAccess: true,
    })

    return newUser
  },

  async verifyCredentials(email: string, passwordString: string) {
    const userExists = await this.getUserByEmail(email)
    if (!userExists) {
      throw new Error('User not registered. Please sign up first.')
    }
    
    const payload = await getPayloadClient()
    
    try {
      // Using Payload's native REST login internally to trigger bcrypt comparison
      const result = await payload.login({
        collection: 'users',
        data: {
          email,
          password: passwordString,
        },
        req: {} as any, // Mock req object
      })
      
      return result.user
    } catch (err) {
      throw new Error('Invalid email or password')
    }
  }
}
