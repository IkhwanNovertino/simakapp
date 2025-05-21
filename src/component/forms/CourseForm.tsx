"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { CourseInputs, courseSchema } from "@/lib/formValidationSchema";
import { createCourse, updateCourse } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Select from "react-select";
import { courseType } from "@/lib/setting";

interface CourseFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany";
  data?: any;
  relatedData?: any;
}

const CourseForm = ({ setOpen, type, data, relatedData }: CourseFormProps) => {
  const { majors, courses } = relatedData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data mata kuliah`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data mata kuliah baru" : "Ubah data mata kuliah"}</h1>

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
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/5">
          <InputField
            label="SKS"
            name="sks"
            defaultValue={data?.sks}
            register={register}
            error={errors?.sks}
            required={true}
            inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <InputField
            label="Nama Mata Kuliah"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
            required={true}
          />
        </div>
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/5">
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Kategori Matkul</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full overflow-hidden"
            {...register("courseType")}
            size={3}
            defaultValue={data?.courseType}
          >
            <option value="" className="text-sm py-0.5">
              -- Pilih kategori mata kuliah
            </option>
            {courseType.map((item: string) => (
              <option
                value={item}
                key={item}
                className="text-sm py-0.5"
              >
                {item}
              </option>
            ))}

          </select>
          {errors.courseType?.message && (
            <p className="text-xs text-red-400">
              {errors.courseType.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/5">
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Program Studi</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("majorId")}
            defaultValue={data?.majorId}
          >
            <option value="" className="text-sm py-0.5">
              -- Pilih program studi
            </option>

            {majors.map((item: any) => (
              <option
                value={item.id}
                key={item.id}
                className="text-sm py-0.5"

              >
                {item.name}
              </option>
            ))}
          </select>
          {errors.majorId?.message && (
            <p className="text-xs text-red-400">
              {errors.majorId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-xs text-gray-500">Mata Kuliah Terdahulu</label>
          <Controller
            name="predecessorId"
            control={control}
            defaultValue={data?.predecessorId || ""}
            render={({ field }) => (
              <Select
                {...field}
                options={courses.map((course: any) => ({
                  value: course.id,
                  label: course.name,
                }))}
                isClearable
                placeholder="-- Pilih mata kuliah terdahulu"
                classNamePrefix="react-select"
                className="text-sm rounded-md"
                onChange={(selected: any) => field.onChange(selected ? selected.value : "")}
                value={
                  courses
                    .map((course: any) => ({
                      value: course.id,
                      label: course.name,
                    }))
                    .find((option: any) => option.value === field.value) || null
                }
              />
            )}
          />
          {/* <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("predecessorId")}
            defaultValue={data?.predecessorId}
          >
            <option value="" className="text-sm py-0.5">
              -- Pilih mata kuliah terdahulu
            </option>

            {courses.map((item: any) => (
              <option
                value={item.id}
                key={item.id}
                className="text-sm py-0.5"
              >
                {item.name}
              </option>
            ))}
          </select> */}
          {errors.predecessorId?.message && (
            <p className="text-xs text-red-400">
              {errors.predecessorId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col items-start gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Mata Kuliah PKL atau Skripsi</label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center justify-center gap-2 w-full">
              <input type="checkbox" id="isPKL" {...register("isPKL")} className="w-4 h-4 " defaultChecked={data?.isPKL} />
              <label htmlFor="isPKL" className="text-sm text-gray-600">PKL</label>
            </div>
            <div className="flex items-center justify-center gap-2 w-full">
              <input type="checkbox" id="isSkripsi" {...register("isSkripsi")} className="w-4 h-4 " defaultChecked={data?.isSkripsi} />
              <label htmlFor="isSkripsi" className="text-sm text-gray-600">Skripsi</label>
            </div>
          </div>
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