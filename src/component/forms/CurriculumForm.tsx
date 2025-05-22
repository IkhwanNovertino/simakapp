"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { CurriculumInputs, curriculumSchema } from "@/lib/formValidationSchema";
import { createCurriculum, updateCurriculum } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";

interface CurriculumFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany";
  data?: any;
  relatedData?: any;
}

const CurriculumForm = ({ setOpen, type, data, relatedData }: CurriculumFormProps) => {
  const { majors } = relatedData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CurriculumInputs>({
    resolver: zodResolver(curriculumSchema)
  })

  const action = type === "create" ? createCurriculum : updateCurriculum
  const [state, formAction] = useActionState(action, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data kurikulum`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data kurikulum baru" : "Ubah data kurikulum"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-3/5">
          <InputField
            label="Kurikulum"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/6">
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

      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Tanggal Mulai"
            name="startDate"
            type="date"
            defaultValue={moment(data?.startDate).format("YYYY-MM-DD")}
            register={register}
            error={errors?.startDate}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Tanggal Selesai"
            name="endDate"
            type="date"
            defaultValue={moment(data?.endDate).format("YYYY-MM-DD")}
            register={register}
            error={errors?.endDate}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Status Kurikulum</label>
          <Controller
            name="isActive"
            control={control}
            defaultValue={!!data?.isActive}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 has-checked:text-indigo-900"
                />
                <label htmlFor="isActive" className="text-sm text-gray-600">
                  Mengaktifkan Kurikulum
                </label>
              </div>
            )}
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

export default CurriculumForm;