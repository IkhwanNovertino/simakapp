"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { PermissionInputs, permissionSchema } from "@/lib/formValidationSchema";
import { createPermission, updatePermission } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { resourceData } from "@/lib/setting";

interface PermissionFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser";
  data?: any;
  relatedData?: any;
}

const PermissionForm = ({ setOpen, type, data, relatedData }: PermissionFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionInputs>({
    resolver: zodResolver(permissionSchema)
  })

  const action = type === "create" ? createPermission : updatePermission;
  const [state, formAction] = useActionState(action, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    console.log(data);

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
        <div className="flex flex-col gap-2 w-full md:w-1/7">
          <label className="text-xs text-gray-500">Pilih aksi</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("action")}
            defaultValue={data?.name.split(":")[0]}
          >
            <option
              value={"view"}
              className="text-sm py-0.5"

            >
              view
            </option>
            <option
              value={"create"}
              className="text-sm py-0.5"
            >
              create
            </option>
            <option
              value={"edit"}
              className="text-sm py-0.5"
            >
              edit
            </option>
            <option
              value={"delete"}
              className="text-sm py-0.5"
            >
              delete
            </option>
          </select>
          {errors.action?.message && (
            <p className="text-xs text-red-400">
              {errors.action.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Modul/Domain</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("resource")}
            defaultValue={data?.name.split(":")[1]}
          >
            {resourceData.map((item: { pathname: string, name: string, nama: string }) => (
              <option
                value={item.pathname}
                key={item.name}
                className="text-sm py-0.5"

              >
                {item.nama}
              </option>
            ))}
          </select>
          {errors.resource?.message && (
            <p className="text-xs text-red-400">
              {errors.resource.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <InputField
            label="Deskripsi Hak Akses"
            name="description"
            defaultValue={data?.description}
            register={register}
            error={errors?.description}
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default PermissionForm;