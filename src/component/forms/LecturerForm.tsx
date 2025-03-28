"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { CourseInputs, courseSchema, LecturerInputs, lecturerSchema } from "@/lib/formValidationSchema";
import { createCourse, createLecturer, updateCourse, updateLecturer } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
      <div className="flex justify-start flex-wrap gap-4">
        {data && (
          <InputField
            label="id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <InputField
          label="Email"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
          inputProps={data && { disabled: true }}
        />
        <InputField
          label="Kata Kunci"
          name="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Dosen Wali?</label>
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
      <div className="flex justify-start flex-wrap gap-4">

        <InputField
          label="NPK"
          name="npk"
          defaultValue={data?.npk}
          register={register}
          error={errors?.npk}
        />
        <InputField
          label="NIDN"
          name="nidn"
          defaultValue={data?.nidn}
          register={register}
          error={errors?.nidn}
        />
        <InputField
          label="Nama Lengkap"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Front Title"
          name="frontTitle"
          defaultValue={data?.frontTitle}
          register={register}
          error={errors?.frontTitle}
        />
        <InputField
          label="Back Title"
          name="backTitle"
          defaultValue={data?.backTitle}
          register={register}
          error={errors?.backTitle}
        />
        <InputField
          label="Tingkat Pendidikan"
          name="degree"
          defaultValue={data?.degree}
          register={register}
          error={errors?.degree}
        />
        <InputField
          label="Tahun Masuk"
          name="year"
          defaultValue={data?.year}
          register={register}
          error={errors?.year}
        />
        <InputField
          label="Program Studi"
          name="majorId"
          defaultValue={data?.majorId}
          register={register}
          error={errors?.majorId}
        />
        <InputField
          label="Personal Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="No. Handphone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Foto Profile"
          name="photo"
          defaultValue={data?.photo}
          register={register}
          error={errors?.photo}
        />
        <InputField
          label="Agama"
          name="religion"
          defaultValue={data?.religion}
          register={register}
          error={errors?.religion}
        />
        <InputField
          label="Alamat"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
      </div>
      {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default LecturerForm;