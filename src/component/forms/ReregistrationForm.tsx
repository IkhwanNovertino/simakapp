"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { PeriodInputs, periodSchema, ReregistrationInputs, reregistrationSchema } from "@/lib/formValidationSchema";
import { createPeriod, createReregistration, createRoom, updatePeriod, updateReregistration, updateRoom } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ReregistrationFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser";
  data?: any;
  relatedData?: any;
}

const ReregistrationForm = ({ setOpen, type, data, relatedData }: ReregistrationFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReregistrationInputs>({
    resolver: zodResolver(reregistrationSchema)
  })

  const { period } = relatedData;

  const action = type === "create" ? createReregistration : updateReregistration;
  const [state, formAction] = useActionState(action, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data herregistrasi`);
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
          <InputField
            label="Titel her registrasi"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Semester</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("periodId")}
            defaultValue={data?.periodId}
          >
            <option
              value=""
              className="text-sm py-0.5 capitalize"
            >
              -- Pilih periode akademik
            </option>
            {period.map(
              (period: { id: string; name: string }) => (
                <option
                  value={period.id} key={period.id}
                  className="text-sm py-0.5 capitalize"
                >
                  {period.name}
                </option>
              ))}
          </select>
          {errors.periodId?.message && (
            <p className="text-xs text-red-400">
              {errors.periodId.message.toString()}
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

export default ReregistrationForm;