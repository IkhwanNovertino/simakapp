"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { RoleInputs, roleSchema } from "@/lib/formValidationSchema";
import { createRole, updateRole } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface RoleFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser";
  data?: any;
  relatedData?: any;
}

const RoleForm = ({ setOpen, type, data, relatedData }: RoleFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleInputs>({
    resolver: zodResolver(roleSchema)
  })

  const { permissions } = relatedData;

  const action = type === "create" ? createRole : updateRole;
  const [state, formAction] = useActionState(action, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data role`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Buat data role baru" : "Ubah data role"}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="hidden">
            <InputField
              label="id"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors?.id}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nama Role"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-4/6">
          <InputField
            label="Deskripsi Role"
            name="description"
            defaultValue={data?.description}
            register={register}
            error={errors?.description}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Pilih Hak Akses</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("rolePermission")}
            defaultValue={data?.RolePermission}
            size={8}
          >
            {permissions.map(
              (permission: { id: string; name: string }) => (
                <option
                  value={permission.id} key={permission.id}
                  className="text-sm py-0.5 capitalize"
                >
                  {permission.name}
                </option>
              )

            )}
          </select>
          <p className="text-xs text-gray-400">
            {"tekan ctrl untuk memilih lebih dari satu"}
          </p>
          {errors.rolePermission?.message && (
            <p className="text-xs text-red-400">
              {errors.rolePermission.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-4/6">
          <div className="text-xs text-gray-500">Tipe role pengguna</div>
          <div className="flex items-center gap-2">
            <input type="radio" id="roleTypeOperator" value={"OPERATOR"} {...register('roleType')} defaultChecked={true} defaultValue={data?.roleType} />
            <label htmlFor="roleTypeOperator" className="text-sm">Operator</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="roleTypeStudent" value={"STUDENT"} {...register('roleType')} defaultChecked={false} defaultValue={data?.roleType} />
            <label htmlFor="roleTypeStudent" className="text-sm">Mahasiswa</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="roleTypeLecturer" value={"LECTURER"} {...register('roleType')} defaultChecked={false} defaultValue={data?.roleType} />
            <label htmlFor="roleTypeLecturer" className="text-sm">Dosen</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="roleTypeAdvisor" value={"ADVISOR"} {...register('roleType')} defaultChecked={false} defaultValue={data?.roleType} />
            <label htmlFor="roleTypeAdvisor" className="text-sm">Perwalian Akademik</label>
          </div>
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default RoleForm;