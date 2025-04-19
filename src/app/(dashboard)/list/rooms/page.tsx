import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleDeleteData, canRoleUpdateData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma, Room } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";

type RoomDataType = Room;

const RoomListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const canCreateData = await canRoleCreateData("rooms");
  const canUpdateData = await canRoleUpdateData("rooms");
  const canDeleteData = await canRoleDeleteData("rooms");
  const canViewData = await canRoleViewData("rooms");
  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.RoomWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction([
    prisma.room.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.room.count({ where: query }),
  ]);

  const renderRow = (item: RoomDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {item.name}
      </td>
      <td className="hidden md:table-cell">{item.location === "BJB" ? "Banjarbaru" : "Banjarmasin"}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td>
        <div className="flex items-center gap-2">
          {canUpdateData && <FormContainer table="room" type="update" data={item} />}
          {canDeleteData && <FormContainer table="room" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  const columns = [
    {
      header: "Ruang/lokal",
      accessor: "ruang/lokal",
    },
    {
      header: "Lokasi",
      accessor: "lokasi",
      className: "hidden md:table-cell",
    },
    {
      header: "Capacity",
      accessor: "capacity",
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
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Ruang/Lokal</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            {canCreateData && (<FormContainer table="room" type="create" />)}

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

export default RoomListPage;