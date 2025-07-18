"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { PositionInputs, positionSchema } from "@/lib/formValidationSchema";
import { createPosition, updatePosition } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormProps } from "@/lib/datatype";


const KrsGradeForm = ({ setOpen, type, data }: FormProps) => {

  console.log('KRSGRADEFORM', data);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PositionInputs>({
    resolver: zodResolver(positionSchema)
  })
  const action = type === "create" ? createPosition : updatePosition;
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
      <h1 className="text-xl font-semibold">{"Tambahkan Data Nilai Mata Kuliah"}</h1>

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
            label="Nama Mahasiswa"
            name="positionName"
            defaultValue={data?.positionName}
            register={register}
            error={errors?.positionName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/6">
          <InputField
            label="NIM"
            name="personName"
            defaultValue={data?.personName}
            register={register}
            error={errors?.personName}
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {"Simpan"}
      </button>
    </form >
  )
}

export default KrsGradeForm;