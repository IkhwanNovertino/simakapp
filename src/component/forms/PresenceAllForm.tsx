"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { PositionInputs, positionSchema, PresenceActivationInputs, presenceActivationSchema, PresenceAllInputs, presenceAllSchema, PresenceInputs, presenceSchema } from "@/lib/formValidationSchema";
import { createPosition, createPresence, presenceActivation, updateManyPresenceStatus, updatePosition, updatePresence } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import { learningMethod, presenceDuration } from "@/lib/setting";
import { FormProps } from "@/lib/datatype";
import InputSelect from "../InputSelect";
import { Presence } from "@prisma/client";


const PresenceAllForm = ({ setOpen, type, data }: FormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PresenceAllInputs>({
    resolver: zodResolver(presenceAllSchema)
  })
  const [state, formAction] = useActionState(updateManyPresenceStatus, { success: false, error: false, message: "" });

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
      <h1 className="text-xl font-semibold">{'Presensi Perkuliahan '}</h1>
      <h4 className="text-base font-medium">{'Status presensi seluruh mahasiswa menjadi "hadir".'}</h4>

      <div className="flex justify-between flex-wrap gap-4">
        {/* {data && (
          <div className="visible">
            <InputField
              label="id"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors?.id}
            />
          </div>
        )} */}
        <div className="flex flex-col gap-2 w-full">
          <InputSelect
            control={control}
            label="Pilih Pertemuan"
            name="presenceId"
            placeholder="Pilih Minggu/Pertemuan ke-..."
            error={errors?.presenceId}
            required={true}
            options={data.map((item: Presence) => ({
              label: `Minggu/Pertemuan ke-${item.weekNumber}`,
              value: item.id,
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

export default PresenceAllForm;