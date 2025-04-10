"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { LecturerInputs, lecturerSchema } from "@/lib/formValidationSchema";
import { createLecturer, updateLecturer } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { degree, gender, religion } from "@/lib/setting";
import Image from "next/image";

interface LecturerFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser";
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

  console.log('is running');


  const action = type === "create" ? createLecturer : updateLecturer;
  // const action = (type === "create" && createLecturer) || (type === "update" && updateLecturer);
  const [state, formAction] = useActionState(action, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    console.log('handleSubmit');
    console.log(data);

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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data dosen baru" : "Ubah data dosen"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Personal
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
            label="NPK"
            name="npk"
            defaultValue={data?.npk}
            register={register}
            error={errors?.npk}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NIDN"
            name="nidn"
            defaultValue={data?.nidn}
            register={register}
            error={errors?.nidn}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Pendidikan Terakhir</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("degree")}
            defaultValue={data?.degree}
          >
            <option value="" className="text-sm py-0.5">
              -- Pilih pendidikan terakhir
            </option>
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
            required={true}
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
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Gender</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full overflow-hidden"
            {...register("gender")}
            size={3}
            defaultValue={data?.gender}
          >
            <option value="" className="text-sm py-0.5">
              -- Pilih gender
            </option>
            {gender.map((item) => (
              <option
                value={item}
                key={item}
                className="text-sm py-0.5"

              >
                {item}
              </option>
            ))}
          </select>
          {errors.gender?.message && (
            <p className="text-xs text-red-400">
              {errors.gender.message.toString()}
            </p>
          )}
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
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Agama</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("religion")}
            defaultValue={data?.religion}
          >
            <option value="" className="text-sm py-0.5">
              -- Pilih agama
            </option>
            {religion.map((item: string) => (
              <option
                value={item}
                key={item}
                className="text-sm py-0.5"

              >
                {item}
              </option>
            ))}
          </select>
          {errors.religion?.message && (
            <p className="text-xs text-red-400">
              {errors.religion.message.toString()}
            </p>
          )}
        </div>
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="photo"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="photo" {...register("photo")} className="hidden" />
          {errors.photo?.message && (
            <p className="text-xs text-red-400">
              {errors.photo.message.toString()}
            </p>
          )}
        </div> */}
        <div className="flex flex-col gap-2 w-full md:w-3/5">
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
      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default LecturerForm;