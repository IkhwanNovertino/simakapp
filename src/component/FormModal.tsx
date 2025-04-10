"use client";

import { deleteCourse, deleteLecturer, deleteMajor, deleteOperator, deletePermission, deleteRole, deleteRoom, deleteStudent } from "@/lib/action";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, JSX, SetStateAction, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface FormModalProps {
  table: "permission"
  | "role"
  | "operator"
  | "lecturer"
  | "lecturerUser"
  | "student"
  | "course"
  | "major"
  | "room"
  type: "create" | "update" | "delete" | "createUser";
  data?: any;
  id?: any;
}

const PermissionForm = dynamic(() => import("./forms/PermissionForm"), {
  loading: () => <h1>Loading...</h1>,
});
const RoleForm = dynamic(() => import("./forms/RoleForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MajorForm = dynamic(() => import("./forms/MajorForm"), {
  loading: () => <h1>Loading...</h1>,
});
const RoomForm = dynamic(() => import("./forms/RoomForm"), {
  loading: () => <h1>Loading...</h1>,
});
const CourseForm = dynamic(() => import("./forms/CourseForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LecturerForm = dynamic(() => import("./forms/LecturerForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LecturerUserForm = dynamic(() => import("./forms/LecturerUserForm"), {
  loading: () => <h1>Loading...</h1>,
});
const OperatorForm = dynamic(() => import("./forms/OperatorForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update" | "createUser",
    data?: any,
    relatedData?: any,
  ) => JSX.Element;
} = {
  permission: (setOpen, type, data, relatedData) =>
    <PermissionForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  role: (setOpen, type, data, relatedData) =>
    <RoleForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  major: (setOpen, type, data, relatedData) =>
    <MajorForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  room: (setOpen, type, data, relatedData) =>
    <RoomForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  course: (setOpen, type, data, relatedData) =>
    <CourseForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  lecturer: (setOpen, type, data, relatedData) =>
    <LecturerForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  lecturerUser: (setOpen, type, data, relatedData) =>
    <LecturerUserForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  operator: (setOpen, type, data, relatedData) =>
    <OperatorForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  student: (setOpen, type, data, relatedData) =>
    <StudentForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
};

const deleteActionMap = {
  permission: deletePermission,
  role: deleteRole,
  operator: deleteOperator,
  lecturer: deleteLecturer,
  lecturerUser: deleteLecturer,
  student: deleteStudent,
  major: deleteMajor,
  room: deleteRoom,
  course: deleteCourse,
}

const FormModal = ({ table, type, data, id, relatedData }: FormModalProps & { relatedData?: any }) => {


  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = (type === "createUser" && "bg-secondary") || (type === "create" && "bg-secondary") || (type === "update" && "bg-ternary") || (type === "delete" && "bg-accent");
  const [open, setOpen] = useState(false);

  const Form = () => {

    const [state, formAction] = useActionState(deleteActionMap[table], { success: false, error: false });

    const router = useRouter();
    useEffect(() => {
      if (state?.success) {
        toast.success(`Data telah berhasil dihapus`);
        router.refresh();
        setOpen(false);
      }
    }, [state, router])

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="string | number" name="id" value={id} readOnly hidden />
        <span className="text-center font-medium">
          Data akan hilang. apakah anda yakin ingin menghapus data {table} ini?
        </span>
        {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Hapus
        </button>
      </form>
    ) : type === "create" || type === "update" || type === "createUser" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    )
  }

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt={`icon-${type}`} width={16} height={16} />
      </button>

      {open && (
        <div className="w-screen h-lvw absolute left-0 top-0 bg-black/60 z-50 flex items-start justify-center">
          <div className="bg-white p-4 relative rounded-md mt-8  w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src={"/close.png"} alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FormModal;