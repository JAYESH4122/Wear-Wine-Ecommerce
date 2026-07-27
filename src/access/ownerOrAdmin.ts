import type { Access, FieldAccess, PayloadRequest } from 'payload'

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

export const ownerOrAdminByID: Access = ({ req: { user } }) => {
  if (!user) return false

  if (hasAdminRole((user as { roles?: unknown }).roles)) {
    return true
  }

  return {
    id: {
      equals: user.id,
    },
  }
}

export const ownerOrAdminCreateByUserField: Access = ({ data, req: { user } }) => {
  if (!user) return false

  if (hasAdminRole((user as { roles?: unknown }).roles)) {
    return true
  }

  const requestedUser =
    data?.user && typeof data.user === 'object' && 'id' in data.user ? data.user.id : data?.user

  return String(requestedUser) === String(user.id)
}

export const adminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return hasAdminRole((user as { roles?: unknown }).roles)
}

export const adminFieldOnly: FieldAccess = ({ req: { user } }) => {
  return hasAdminRole((user as { roles?: unknown } | null)?.roles)
}

export const adminPanelOnly = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  return hasAdminRole((user as { roles?: unknown } | null)?.roles)
}

export const isAdmin = ({
  req: { user },
}: {
  req: { user?: { roles?: unknown } | null }
}): boolean => {
  return hasAdminRole(user?.roles)
}
