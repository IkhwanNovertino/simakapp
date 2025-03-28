"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { CourseInputs, courseSchema, LecturerInputs, lecturerSchema, OperatorInputs, operatorSchema } from "@/lib/formValidationSchema";
import { createCourse, createLecturer, createOperator, updateCourse, updateLecturer, updateOperator } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface LecturerFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
}

const LecturerForm = ({ setOpen, type, data, relatedData }: LecturerFormProps) => {
  const { majors } = relatedData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OperatorInputs>({
    resolver: zodResolver(operatorSchema)
  })

  const action = type === "create" ? createOperator : updateOperator;
  const [state, formAction] = useActionState(action, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data program studi`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data program studi baru" : "Ubah data program studi"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Autentikasi
      </span>
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
          label="Email"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
          inputProps={data && { disabled: true }}
        />
        <InputField
          label="Kata Kunci"
          name="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Personal
      </span>
      <div className="flex justify-start flex-wrap gap-4">

        <InputField
          label="Nama Lengkap"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Bagian"
          name="department"
          defaultValue={data?.department}
          register={register}
          error={errors?.department}
        />
      </div>
      {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default LecturerForm;