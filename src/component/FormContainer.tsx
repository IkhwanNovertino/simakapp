import { prisma } from "@/lib/prisma";
import FormModal, { FormModalProps } from "./FormModal";

const FormContainer = async (
  { table, type, data, id }: FormModalProps
) => {
  let relatedData = {};
  if (type !== "delete") {
    switch (table) {
      case "role":
        const rolePermission = await prisma.permission.findMany({
          select: { id: true, name: true },
        });
        relatedData = { permissions: rolePermission };
        break;
      case "rolePermission":
        const permissions = await prisma.permission.findMany({
          select: { id: true, name: true },
        });
        relatedData = { permissions: permissions };
        break;
      case "course":
        const majors = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        relatedData = { majors: majors };
        break;
      case "operator":
        const role = await prisma.role.findMany({
          select: { id: true, name: true },
        });
        relatedData = { role: role };
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    </div>
  )
}

export default FormContainer;