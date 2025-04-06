'use server';
import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import ToggleSwitch from "@/component/ToggleSwitch";
import { getRolePermission } from "@/lib/action";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Permission, Prisma, Role, RolePermission } from "@prisma/client";

type PermissionDataType = Permission;

// const renderRow = (item: PermissionDataType) => {

//   const [isChecked, setIsChecked] = useState(false);
//   const { id } = useParams() as { id: string };
//   useEffect(() => {
//     const checkRolePermission = async () => {
//       const rolePermission = await getRolePermission({ role: parseInt(id), permission: item.id }) || false;
//       setIsChecked(rolePermission);
//     };
//     checkRolePermission();
//   }, [id, item.id]);

//   return (
//     <tr key={item.id}>
//       <td className="p-4">{item.name}</td>
//       <td className="hidden md:table-cell">{item.description}</td>
//       <td>
//         <div className="flex items-center gap-2">
//           <ToggleSwitch
//             roleId={parseInt(id)}
//             permissionId={item.id}
//             isChecked={isChecked}
//             onChange={(isChecked) => setIsChecked(isChecked)}
//           />
//         </div>
//       </td>
//     </tr>
//   );
// };

const SingleRolePage = async (
  {
    searchParams,
    params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  },
) => {

  const { page } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { id } = await params;

  const [dataRole, data, count] = await prisma.$transaction([
    prisma.role.findFirst({
      where: { id: parseInt(id) }
    }),
    prisma.permission.findMany({
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.permission.count({}),
  ]);
  const renderRow = (item: PermissionDataType) => (
    <tr
      key={item.id}
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td>
        <div className="flex items-center gap-2">
          <ToggleSwitch id={`${id}:${item.id}`} />
          {/* <FormContainer table="rolePermission" type="delete" id={`${id}:${item.id}`} /> */}
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
        <h1 className="hidden md:block text-lg font-semibold ">Hak akses untuk {dataRole?.name}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
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

export default SingleRolePage;