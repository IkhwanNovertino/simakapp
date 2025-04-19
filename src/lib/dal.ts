'use server';
import { prisma } from "./prisma";
import { getSession } from "./session"

export const getSidebarItemsByRole = async () => {
  const getSessionData = await getSession();
  if (!getSessionData) return null;

  const permissionByRole = await prisma.rolePermission.findMany({
    where: {
      roleId: getSessionData.roleId!,
    },
    include: {
      permission: true,
    },
  });
  const viewPermission = permissionByRole
    .map((permission) => permission?.permission?.name)
    .filter((permissionName) => permissionName?.startsWith('view:'))
    .map((pathname) => pathname?.split(':')[1]);
  
  return viewPermission
  
}

export const redirectDashboardByRole = async () => {
  const getSessionData = await getSession();
  if (!getSessionData) return null;
  const roleType = getSessionData.roleType;
  switch (roleType) {
    case "OPERATOR":
      return "admin";
    case "LECTURER":
      return "lecturer";
    case "ADVISOR":
      return "lecturer";
    case "STUDENT":
      return "student";
    default:
      return null;
  }
}