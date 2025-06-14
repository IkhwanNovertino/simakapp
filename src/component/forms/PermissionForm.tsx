"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { PermissionInputs, permissionSchema } from "@/lib/formValidationSchema";
import { createPermission, updatePermission } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { actionPermission, resourceData } from "@/lib/setting";
import InputSelect from "../InputSelect";

interface PermissionFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany";
  data?: any;
  relatedData?: any;
}

const PermissionForm = ({ setOpen, type, data }: PermissionFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PermissionInputs>({
    resolver: zodResolver(permissionSchema)
  })

  const action = type === "create" ? createPermission : updatePermission;
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })


  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            label="Pilih Aksi"
            name="action"
            defaultValue={data?.name.split(":")[0]}
            control={control}
            error={errors?.action}
            required={true}
            options={actionPermission.map((item: any) => ({
              value: item,
              label: item
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            label="Pilih Modul/Domain"
            name="resource"
            defaultValue={data?.name.split(":")[1]}
            control={control}
            error={errors?.resource}
            required={true}
            options={resourceData.map((item: any) => ({
              value: item.pathname,
              label: item.nama
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/8">
          <InputField
            label="Deskripsi Hak Akses"
            name="description"
            defaultValue={data?.description}
            register={register}
            error={errors?.description}
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default PermissionForm;