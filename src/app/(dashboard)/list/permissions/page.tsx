import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleDeleteData, canRoleUpdateData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";

type PermissionDataType = {
  id: number;
  name: string;
  description: string;
};

const PermissionListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const canCreateData = await canRoleCreateData("permissions");
  const canUpdateData = await canRoleUpdateData("permissions");
  const canDeleteData = await canRoleDeleteData("permissions");
  const canViewData = await canRoleViewData("permissions");

  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.PermissionWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { description: { contains: value, mode: "insensitive" } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction([
    prisma.permission.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.permission.count({ where: query }),
  ]);

  const renderRow = (item: PermissionDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
    >
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
        <div className="flex flex-col col-span-5 items-start">
          <h3 className="font-semibold">{item.name}</h3>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <ModalAction>
            <div className="flex items-center gap-3">
              {canUpdateData && (<FormContainer table="permission" type="update" data={item} />)}
              {canDeleteData && (<FormContainer table="permission" type="delete" id={item.id} />)}
            </div>
          </ModalAction>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          {canUpdateData && (<FormContainer table="permission" type="update" data={item} />)}
          {canDeleteData && (<FormContainer table="permission" type="delete" id={item.id} />)}
        </div>
      </td>
    </tr>
  );

  const columns = [
    {
      header: "Hak Akses",
      accessor: "hak akses",
      className: "px-2 md:px-4",
    },
    {
      header: "Deskripsi",
      accessor: "deskripsi",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Hak Akses Pengguna</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {canCreateData && (<FormContainer table="permission" type="create" />)}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default PermissionListPage;