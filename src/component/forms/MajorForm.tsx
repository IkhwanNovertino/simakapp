"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { MajorInputs, majorSchema } from "@/lib/formValidationSchema";
import { createMajor, updateMajor } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface PermissionFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser";
  data?: any;
  relatedData?: any;
}

const PermissionForm = ({ setOpen, type, data }: PermissionFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MajorInputs>({
    resolver: zodResolver(majorSchema)
  })

  const [state, formAction] = useActionState(type === "create" ? createMajor : updateMajor, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    console.log('handleSubmitMajor');

    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data program studi`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data program studi baru" : "Ubah data program studi"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-1/5">
          <InputField
            label="Kode Angka"
            name="numberCode"
            defaultValue={data?.numberCode}
            register={register}
            error={errors?.numberCode}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/5">
          <InputField
            label="Kode Huruf"
            name="stringCode"
            defaultValue={data?.stringCode}
            register={register}
            error={errors?.stringCode}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <InputField
            label="Nama Program Studi"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default PermissionForm;