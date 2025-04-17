import { prisma } from '@/lib/prisma'
import { getDbSession } from './session-db'

export async function getSidebarItems() {
  const session = await getDbSession()
  if (!session) return []

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      role: {
        include: {
          rolePermission: {
            include: {
              permission: true
            }
          },
        },
      },
    },
  })
  if (!user) return []

  return user.role?.rolePermission
    .map((permission) => permission.permission?.name)
    .filter((name) => name?.startsWith('view:'))
    .map((name) => name?.split(':')[1]);
}