"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { PeriodInputs, periodSchema } from "@/lib/formValidationSchema";
import { createPeriod, createRoom, updatePeriod, updateRoom } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface PeriodFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser";
  data?: any;
  relatedData?: any;
}

const PeriodForm = ({ setOpen, type, data }: PeriodFormProps) => {

  // untuk membuat +10thn dan -10thn di dropdown select
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => `${currentYear - 10 + i}/${currentYear - 10 + i + 1}`);
  console.log(years);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PeriodInputs>({
    resolver: zodResolver(periodSchema)
  })
  const action = type === "create" ? createPeriod : updatePeriod;
  const [state, formAction] = useActionState(action, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data periode akademik`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data periode akademik baru" : "Ubah data periode akademik"}</h1>

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
          <label className="text-xs text-gray-500">Tahun Akademik</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("year")}
            defaultValue={data?.year}
          >
            <option
              value=""
              className="text-sm py-0.5 capitalize"
            >
              -- Pilih tahun akademik --
            </option>
            {years.map((year) => (
              <option
                value={year} key={year}
                className="text-sm py-0.5 capitalize"
              >
                {year}
              </option>
            ))}

          </select>
          {errors.year?.message && (
            <p className="text-xs text-red-400">
              {errors.year.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Semester</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("semesterType")}
            defaultValue={data?.semesterType}
          >
            <option
              value=""
              className="text-sm py-0.5 capitalize"
            >
              -- Pilih semester
            </option>
            <option
              value={"GANJIL"} key={"GANJIL"}
              className="text-sm py-0.5 capitalize"
            >
              Ganjil
            </option>
            <option
              value={"GENAP"} key={"GENAP"}
              className="text-sm py-0.5 capitalize"
            >
              Genap
            </option>
          </select>
          {errors.semesterType?.message && (
            <p className="text-xs text-red-400">
              {errors.semesterType.message.toString()}
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

export default PeriodForm;