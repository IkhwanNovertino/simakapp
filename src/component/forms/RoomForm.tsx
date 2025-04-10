"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InputField from "../InputField";
import { RoomInputs, roomSchema } from "@/lib/formValidationSchema";
import { createRoom, updateRoom } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface RoomFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser";
  data?: any;
  relatedData?: any;
}

const RoomForm = ({ setOpen, type, data, relatedData }: RoomFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomInputs>({
    resolver: zodResolver(roomSchema)
  })
  const action = type === "create" ? createRoom : updateRoom;
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
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <InputField
            label="Nama Ruang/Lokal"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Lokasi</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("location")}
            defaultValue={data?.location}
          >
            <option
              value={"BJM"} key={"bjm"}
              className="text-sm py-0.5 capitalize"
            >
              Banjarmasin
            </option>
            <option
              value={"BJB"} key={"bjb"}
              className="text-sm py-0.5 capitalize"
            >
              Banjarbaru
            </option>
          </select>
          {errors.location?.message && (
            <p className="text-xs text-red-400">
              {errors.location.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/6">
          <InputField
            label="Kapasitas"
            name="capacity"
            type="number"
            defaultValue={data?.capacity}
            register={register}
            error={errors?.capacity}
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

export default RoomForm;