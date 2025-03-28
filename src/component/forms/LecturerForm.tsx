"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { CourseInputs, courseSchema, LecturerInputs, lecturerSchema } from "@/lib/formValidationSchema";
import { createCourse, createLecturer, updateCourse, updateLecturer } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { degree } from "@/lib/setting";

interface LecturerFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
}

const LecturerForm = ({ setOpen, type, data, relatedData }: LecturerFormProps) => {
  const { majors } = relatedData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LecturerInputs>({
    resolver: zodResolver(lecturerSchema)
  })

  const action = type === "create" ? createLecturer : updateLecturer;
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
      <span className="text-xs text-gray-400 font-medium">
        Informasi Autentikasi
      </span>
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Email"
            name="username"
            defaultValue={data?.username}
            register={register}
            error={errors?.username}
            inputProps={data && { disabled: true }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Kata Kunci"
            name="password"
            defaultValue={data?.password}
            register={register}
            error={errors?.password}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Apakah user ini adalah dosen wali?</label>
          <input
            type="checkbox"
            id="isDosenWali"
            className="w-fit"
            {...register("isDosenWali")}
            defaultChecked={data?.isDosenWali}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Personal
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NPK"
            name="npk"
            defaultValue={data?.npk}
            register={register}
            error={errors?.npk}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NIDN"
            name="nidn"
            defaultValue={data?.nidn}
            register={register}
            error={errors?.nidn}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Tingkat Pendidikan</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("degree")}
            defaultValue={data?.degree}
          >
            {degree.map((item) => (
              <option
                value={item}
                key={item}
                className="text-sm py-0.5"

              >
                {item}
              </option>
            ))}
          </select>
          {errors.degree?.message && (
            <p className="text-xs text-red-400">
              {errors.degree.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Gelar Nama Depan"
            name="frontTitle"
            defaultValue={data?.frontTitle}
            register={register}
            error={errors?.frontTitle}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nama Lengkap"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Gelar Nama Belakang"
            name="backTitle"
            defaultValue={data?.backTitle}
            register={register}
            error={errors?.backTitle}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Tahun Masuk"
            name="year"
            defaultValue={data?.year}
            register={register}
            error={errors?.year}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Program Studi"
            name="majorId"
            defaultValue={data?.majorId}
            register={register}
            error={errors?.majorId}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Personal Email"
            name="email"
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="No. Handphone"
            name="phone"
            defaultValue={data?.phone}
            register={register}
            error={errors?.phone}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Foto Profile"
            name="photo"
            defaultValue={data?.photo}
            register={register}
            error={errors?.photo}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Agama"
            name="religion"
            defaultValue={data?.religion}
            register={register}
            error={errors?.religion}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Alamat"
            name="address"
            defaultValue={data?.address}
            register={register}
            error={errors?.address}
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

export default LecturerForm;