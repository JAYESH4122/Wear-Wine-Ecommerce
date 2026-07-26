import type { CollectionConfig } from 'payload'

import {
  adminFieldOnly,
  adminOnly,
  adminPanelOnly,
  ownerOrAdminByID,
} from '@/access/ownerOrAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    admin: adminPanelOnly,
    create: adminOnly,
    read: ownerOrAdminByID,
    update: ownerOrAdminByID,
    delete: adminOnly,
    unlock: adminOnly,
  },
  auth: {
    verify: true,
    cookies: {
      secure: true,
      sameSite: 'Lax',
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
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
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
        create: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
        update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
      },
    },
  ],
}
