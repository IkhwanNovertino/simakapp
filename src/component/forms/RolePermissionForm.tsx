"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { RoleInputs, RolePermissionInputs, rolePermissionSchema, roleSchema } from "@/lib/formValidationSchema";
import { createRole, createRolePermission, updateRole } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface RolePermissionFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
}

const RoleForm = ({ setOpen, type, data, relatedData }: RolePermissionFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RolePermissionInputs>({
    resolver: zodResolver(rolePermissionSchema),
  })

  const { permissions } = relatedData;

  const [state, formAction] = useActionState(createRolePermission, { success: false, error: false });

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
      <h1 className="text-xl font-semibold">Tambah hak akses baru untuk {data.roleName}</h1>

      <div className="flex justify-start flex-wrap gap-4">
        {data && (
          <div className="hidden">
            <InputField
              label="id"
              name="roleId"
              defaultValue={data?.roleId}
              register={register}
              error={errors?.roleId}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <InputField
            label="Nama Role"
            name="roleName"
            defaultValue={data?.roleName}
            register={register}
            error={errors?.roleName}
            inputProps={{ disabled: true }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <InputField
            label="Deskripsi Role"
            name="roleDescription"
            defaultValue={data?.roleDescription}
            register={register}
            error={errors?.roleDescription}
            inputProps={{ disabled: true }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Pilih Hak Akses</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("permission")}
            defaultValue={data?.rolePermission}
          >
            {permissions.map(
              (permission: { id: string; name: string }) => (
                <option
                  value={permission.id} key={permission.id}
                  className="text-sm py-0.5 capitalize"
                  disabled={permission.id === data?.permission?.id}
                >
                  {permission.name}
                </option>
              )
            )}
          </select>
          {errors.permission?.message && (
            <p className="text-xs text-red-400">
              {errors.permission.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">ada kesalahan. silakan pilih hak akses lain!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default RoleForm;