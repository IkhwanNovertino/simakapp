
import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Permission, Prisma, Role, RolePermission } from "@prisma/client";

type PermissionDataType = Permission;

const SingleRolePage = async (
  { searchParams, params: { id } }: { searchParams: { [key: string]: string | undefined }, params: { id: string } },
) => {

  const { page } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const [dataRes, count] = await prisma.$transaction([
    prisma.role.findMany({
      where: {
        id: parseInt(id),
      },
      include: {
        rolePermission: {
          include: {
            permission: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.rolePermission.count({
      where: {
        roleId: parseInt(id),
      },
    }),
  ]);

  const data = {
    roleId: dataRes[0]?.id,
    roleName: dataRes[0]?.name,
    roleDescription: dataRes[0]?.description,
    permission: dataRes[0]?.rolePermission.map((item) => item.permission?.id),
  };
  const dataTable = dataRes[0]?.rolePermission.map((item) => item.permission)

  const renderRow = (item: PermissionDataType) => (
    <tr
      key={`${item.id}:${data.roleId}`}
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormContainer table="rolePermission" type="delete" id={`${data.roleId}:${item.id}`} />
        </div>
      </td>
    </tr >
  );

  const columns = [
    {
      header: "Hak Akses",
      accessor: "hak akses",
      className: "pl-4",
    },
    {
      header: "Deskripsi",
      accessor: "deskripsi",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between md:mb-4">
        <h1 className="hidden md:block text-lg font-semibold ">Detail {data.roleName} beserta hak aksesnya</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button> */}
            <FormContainer table="rolePermission" type="create" data={data} />
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={dataTable} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default SingleRolePage;