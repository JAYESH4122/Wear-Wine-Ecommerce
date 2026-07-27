import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    admin: ({ req: { user } }) => {
      if (!user) return true
      return user.roles?.includes('admin')
    },
    read: () => true,
    create: () => true,
  },
  auth: {
    verify: true,
    cookies: {
      secure: true,
      sameSite: 'None',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'googleId',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
      },
    },
  ],
}
