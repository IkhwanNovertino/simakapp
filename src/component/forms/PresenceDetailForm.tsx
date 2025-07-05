"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { PositionInputs, positionSchema, PresenceActivationInputs, presenceActivationSchema, PresenceInputs, presenceSchema } from "@/lib/formValidationSchema";
import { createPosition, createPresence, presenceActivation, updatePosition, updatePresence } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import { learningMethod, presenceDuration } from "@/lib/setting";
import { FormProps } from "@/lib/datatype";
import InputSelect from "../InputSelect";


const PresenceDetailForm = ({ setOpen, type, data }: FormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PresenceActivationInputs>({
    resolver: zodResolver(presenceActivationSchema)
  })
  const [state, formAction] = useActionState(presenceActivation, { success: false, error: false, message: "" });

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
      <h1 className="text-xl font-semibold">{'Mengaktifkan Presensi Perkuliahan'}</h1>

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
            defaultValue={`Minggu ${data?.weekNumber} | Kelas ${data?.academicClass.name} | ${data?.academicClass.course.name}`}
            register={register}
            inputProps={{ readOnly: true, disabled: true }}
            error={errors?.academicClass}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputSelect
            control={control}
            label="Aktifkan Presensi"
            name="durationPresence"
            defaultValue={data?.isActive ? "AKTIF" : "NONAKTIF"}
            error={errors?.durationPresence}
            placeholder="Lama Presensi Aktif"
            required={true}
            options={presenceDuration.map((item: { label: string, value: string }) => ({
              label: item.label,
              value: item.value,
            }))}
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {"Aktifkan Presensi"}
      </button>
    </form >
  )
}

export default PresenceDetailForm;