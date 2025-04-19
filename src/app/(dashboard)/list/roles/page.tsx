import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleDeleteData, canRoleUpdateData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Permission, Prisma, Role, RolePermission } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type RoleDataType = Role & {
  rolePermission: {
    permission: Permission;
  }[];
}

const RoleListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const canCreateData = await canRoleCreateData("roles");
  const canDeleteData = await canRoleDeleteData("roles");
  const canViewData = await canRoleViewData("roles");
  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.RoleWhereInput = {}
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
    prisma.role.findMany({
      where: query,
      include: {
        rolePermission: {
          include: {
            permission: {
              select: {
                name: true,
                id: true
              }
            },
          },
          take: 10,
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.role.count({ where: query }),
  ]);

  const renderRow = (item: RoleDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-100 text-sm hover:bg-ternary-light"
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td className="hidden lg:table-cell md:flex-wrap md:w-56 lg:w-80 xl:w-xl">
        {item.rolePermission.map(el => (
          <div key={el.permission.id} className="text-xs m-1 p-1.5 inline-block max-w-fit rounded even:bg-primary odd:bg-secondary">{el.permission.name}</div>
        ))}
        {item.rolePermission.length === 10 && <span className="text-lg mx-3 inline-block">...</span>}
      </td >
      <td>
        <div className="flex items-center gap-2">
          {canViewData && (
            <Link href={`/list/roles/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                <Image src="/icon/view.svg" alt="" width={20} height={20} />
              </button>
            </Link>
          )}
          {canDeleteData && (<FormContainer table="role" type="delete" id={item.id} />)}

        </div>
      </td>
    </tr >
  );

  const columns = [
    {
      header: "Role",
      accessor: "role",
      className: "pl-4",
    },
    {
      header: "Deskripsi",
      accessor: "deskripsi",
      className: "hidden md:table-cell",
    },
    {
      header: "Hak Akses",
      accessor: "hak akses",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Role Pengguna</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button> */}
            {canCreateData && (<FormContainer table="role" type="create" />)}
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

export default RoleListPage;