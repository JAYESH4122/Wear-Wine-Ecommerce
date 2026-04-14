import type { Access } from 'payload'

const hasAdminRole = (roles: unknown): boolean => {
  return Array.isArray(roles) && roles.includes('admin')
}

export const ownerOrAdminByUserField: Access = ({ req: { user } }) => {
  if (!user) return false

  if (hasAdminRole((user as { roles?: unknown }).roles)) {
    return true
  }

  return {
    user: {
      equals: user.id,
    },
  }
}

export const adminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return hasAdminRole((user as { roles?: unknown }).roles)
}

export const isAdmin = ({ req: { user } }: { req: { user?: any } }): boolean => {
  return hasAdminRole(user?.roles)
}
