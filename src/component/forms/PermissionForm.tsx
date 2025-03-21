"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InputField from "../InputField";
import { PermissionInputs, permissionSchema } from "@/lib/formValidationSchema";
import { createPermission, updatePermission } from "@/lib/action";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface PermissionFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
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


  const [state, formAction] = useActionState(type === "create" ? createPermission : updatePermission, { success: false, error: false });

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
          label="Hak Akses"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Deskripsi Hak Akses"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
      </div>
      {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default PermissionForm;