import FilterSearch from "@/component/FilterSearch";
import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleCreateDataUser, canRoleDeleteData, canRoleUpdateData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Lecturer, Major, Prisma, Student, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type StudentDataType = Student & { major: Major } & { user: User } & { lecturer: Lecturer };

const StudentListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const canCreateData = await canRoleCreateData("students");
  const canUpdateData = await canRoleUpdateData("students");
  const canDeleteData = await canRoleDeleteData("students");
  const canViewData = await canRoleViewData("students");
  const canCreateUser = await canRoleCreateDataUser();

  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.StudentWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { nim: { contains: value } },
              { lecturer: { name: { contains: value, mode: "insensitive" } } }
            ]
            break;
          case "filter":
            query.majorId = parseInt(value)
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count, dataFilter] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        major: {
          select: {
            name: true,
            id: true
          }
        },
        user: true,
        lecturer: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.student.count({ where: query }),
    prisma.major.findMany({
      select: { id: true, name: true }
    })
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-4",
    },
    {
      header: "NIM",
      accessor: "nim",
      className: "hidden md:table-cell",
    },
    {
      header: "Program Studi",
      accessor: "program studi",
      className: "hidden md:table-cell",
    },
    {
      header: "Perwalian",
      accessor: "perwalian",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  const renderRow = (item: StudentDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photo || '/avatar.png'}
          alt=""
          width={40}
          height={40}
          className="hidden lg:block w-16 h-16 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.user?.email || ""}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item?.nim || "-"}</td>
      <td className="hidden md:table-cell">{item.major?.name || "-"}</td>
      <td className="hidden lg:table-cell">{item.lecturer?.name || "-"}</td>
      <td>
        <div className="flex items-center gap-2">
          {canViewData && (
            <Link href={`/list/stundents/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                <Image src="/icon/view.svg" alt="" width={20} height={20} />
              </button>
            </Link>
          )}
          {canUpdateData && <FormContainer table="student" type="update" data={item} />}
          {canCreateUser && (<FormContainer table="studentUser" type={item.user ? "updateUser" : "createUser"} data={item} />)}
          {canDeleteData && (<FormContainer table="student" type="delete" id={item.id} />)}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Mahasiswa</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {canCreateData && (<FormContainer table="student" type="create" />)}
          </div>
        </div>
      </div>
      <FilterSearch data={dataFilter} />
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default StudentListPage;