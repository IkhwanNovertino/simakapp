"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { RoleInputs, roleSchema } from "@/lib/formValidationSchema";
import { createPermission, createRole, updatePermission } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface RoleFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
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



  const [state, formAction] = useActionState(createRole, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data hak akses`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Buat data hak akses baru" : "Ubah data hak akses"}</h1>

      <div className="flex justify-start flex-wrap gap-4">
        {data && (
          <InputField
            label="id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <InputField
          label="Nama Role"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Deskripsi Role"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Pilih Hak Akses</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("rolePermission")}
            defaultValue={data?.rolePermission}
            size={8}
          >
            {permissions.map(
              (permission: { id: string; name: string }) => (
                <option value={permission.id} key={permission.id} className="text-sm py-0.5 capitalize">
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
      </div>
      {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default RoleForm;