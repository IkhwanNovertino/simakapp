"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { PositionInputs, positionSchema, PresenceInputs, presenceSchema } from "@/lib/formValidationSchema";
import { createPosition, createPresence, updatePosition, updatePresence } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import { learningMethod } from "@/lib/setting";
import { FormProps } from "@/lib/datatype";


const PresenceDetailForm = ({ setOpen, type, data }: FormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PresenceInputs>({
    resolver: zodResolver(presenceSchema)
  })
  const action = type === "create" ? createPresence : updatePresence;
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
      <h1 className="text-xl font-semibold">{'Formulir Jurnal Perkuliahan'}</h1>

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
            <InputField
              label="academicClassId"
              name="academicClassId"
              defaultValue={data?.academicClassId}
              register={register}
              error={errors?.academicClassId}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          <InputField
            label="Info Kelas"
            name="academicClass"
            defaultValue={`Kelas ${data?.academicClass.name} | ${data?.academicClass.course.name}`}
            register={register}
            inputProps={{ readOnly: true, disabled: true }}
            error={errors?.academicClass}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="Pertemuan/Minggu"
            name="weekNumber"
            defaultValue={data?.weekNumber}
            register={register}
            inputProps={{ readOnly: true }}
            error={errors?.weekNumber}
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default PresenceDetailForm;