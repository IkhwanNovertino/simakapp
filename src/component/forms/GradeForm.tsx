"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { GradeInputs, gradeSchema } from "@/lib/formValidationSchema";
import { createGrade, updateGrade } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface GradeFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany";
  data?: any;
  relatedData?: any;
}

const GradeForm = ({ setOpen, type, data }: GradeFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeInputs>({
    resolver: zodResolver(gradeSchema)
  })
  const action = type === "create" ? createGrade : updateGrade;
  const [state, formAction] = useActionState(action, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data Komponen nilai`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data komponen nilai baru" : "Ubah data komponen nilai"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <InputField
            label="Komponen Nilai"
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

export default GradeForm;