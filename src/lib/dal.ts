'use server';
import { getSession } from "./session"

export const getSidebarItems = async () => {
  const getSessionData = await getSession();
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