"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { CourseInputs, courseSchema } from "@/lib/formValidationSchema";
import { createCourse, updateCourse } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface CourseFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser";
  data?: any;
  relatedData?: any;
}

const CourseForm = ({ setOpen, type, data, relatedData }: CourseFormProps) => {
  const { majors } = relatedData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseInputs>({
    resolver: zodResolver(courseSchema)
  })

  const action = type === "create" ? createCourse : updateCourse
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
            label="Kode Mata Kuliah"
            name="code"
            defaultValue={data?.code}
            register={register}
            error={errors?.code}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <InputField
            label="Nama Mata Kuliah"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/6">
          <InputField
            label="SKS"
            name="sks"
            defaultValue={data?.sks}
            register={register}
            error={errors?.sks}
            inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Program Studi</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("majorId")}
            defaultValue={data?.majorId}
          >
            {majors.map(
              (major: { id: number, name: string }) => (
                <option
                  value={major.id} key={major.id}
                  className="text-sm py-0.5 capitalize"
                >
                  {major.name}
                </option>
              )
            )}
          </select>
          {errors.majorId?.message && (
            <p className="text-xs text-red-400">
              {errors.majorId.message.toString()}
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

export default CourseForm;