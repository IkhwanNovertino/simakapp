import "server-only";
export const dashboardRouter = async (roleType: string) => {
  let pathname: string = "";
  switch (roleType) {
    case "STUDENT":
      return "/student";
    case "LECTURER":
      return "/lecturer";
    case "ADVISOR":
      return "/lecturer";
    case "OPERATOR":
      return "/admin";
    default:
      return "/"
  }
}