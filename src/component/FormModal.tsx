"use client";

import { Dispatch, JSX, SetStateAction, useActionState, useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { deleteCourse, deleteLecturer, deleteMajor, deleteOperator, deletePeriod, deletePermission, deleteReregistration, deleteRole, deleteRoom, deleteStudent } from "@/lib/action";
import { toast } from "react-toastify";

export interface FormModalProps {
  table: "permission"
  | "role"
  | "operator"
  | "lecturer"
  | "lecturerUser"
  | "operatorUser"
  | "studentUser"
  | "student"
  | "course"
  | "major"
  | "room"
  | "period"
  | "reregistration"
  | "reregistrationCreateAll"
  type: "create" | "update" | "delete" | "createUser" | "updateUser";
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
const OperatorUserForm = dynamic(() => import("./forms/OperatorUserForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentUserForm = dynamic(() => import("./forms/StudentUserForm"), {
  loading: () => <h1>Loading...</h1>,
});
const PeriodForm = dynamic(() => import("./forms/PeriodForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ReregistrationForm = dynamic(() => import("./forms/ReregistrationForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ReregistrationCreateAllForm = dynamic(() => import("./forms/ReregisterCreateAll"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update" | "createUser" | "updateUser",
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
  operatorUser: (setOpen, type, data, relatedData) =>
    <OperatorUserForm
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
  studentUser: (setOpen, type, data, relatedData) =>
    <StudentUserForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  period: (setOpen, type, data, relatedData) =>
    <PeriodForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  reregistration: (setOpen, type, data, relatedData) =>
    <ReregistrationForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  reregistrationCreateAll: (setOpen, type, data, relatedData) =>
    <ReregistrationCreateAllForm
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
  operatorUser: deleteLecturer,
  studentUser: deleteLecturer,
  student: deleteStudent,
  major: deleteMajor,
  room: deleteRoom,
  course: deleteCourse,
  period: deletePeriod,
  reregistration: deleteReregistration,
  reregistrationCreateAll: deleteReregistration,
};

const namaTabelMap = {
  permission: "hak akses",
  role: "role",
  operator: "operator",
  lecturer: "dosen",
  lecturerUser: "user dosen",
  operatorUser: "user operator",
  studentUser: "user mahasiswa",
  student: "mahasiswa",
  major: "program studi",
  room: "ruang/lokal",
  course: "mata kuliah",
  period: "periode akademik",
  reregistration: "herregistrasi",
  reregistrationCreateAll: "herregistrasi",
}

const FormModal = ({ table, type, data, id, relatedData }: FormModalProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = (type === "createUser" && "bg-secondary") || (type === "create" && "bg-secondary")
    || (type === "update" && "bg-ternary") || (type === "updateUser" && "bg-purple-500/60")
    || (type === "delete" && "bg-accent");
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
          Data akan hilang. apakah anda yakin ingin menghapus data {namaTabelMap[table]} ini?
        </span>
        {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Hapus
        </button>
      </form>
    ) : type === "create" || type === "update" || type === "createUser" || type === "updateUser" ? (
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
        <Image src={`/icon/${type}.svg`} alt={`icon-${type}`} width={20} height={20} />
      </button>

      {open && (
        <div className="w-screen h-screen fixed z-[9999] left-0 top-0 bg-black/60  flex items-start justify-center overflow-scroll">
          <div className="bg-white p-4 relative rounded-md mt-8  w-[88%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] h-fit">
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