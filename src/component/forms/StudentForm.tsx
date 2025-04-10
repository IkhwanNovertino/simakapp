"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { StudentInputs, studentSchema } from "@/lib/formValidationSchema";
import { createStudent, updateStudent } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { degree, gender, religion } from "@/lib/setting";
import Image from "next/image";

interface StudentFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser";
  data?: any;
  relatedData?: any;
}

const StudentForm = ({ setOpen, type, data, relatedData }: StudentFormProps) => {
  const { majors, role, lecturer } = relatedData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentInputs>({
    resolver: zodResolver(studentSchema)
  })

  const action = type === "create" ? createStudent : updateStudent;
  const [state, formAction] = useActionState(action, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    console.log('Running');

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
            defaultValue={data?.user.email}
            register={register}
            error={errors?.username}
            inputProps={data && { disabled: true }}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Kata Kunci"
            name="password"
            type="password"
            defaultValue={data?.user.password}
            register={register}
            inputProps={data && { disabled: true }}
            error={errors?.password}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Role Pengguna</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("roleId")}
            defaultValue={data?.user.roleId}
            disabled={true}
          >
            {role.map((item: any) => (
              <option
                key={item.id}
                value={item.id}
                className="text-sm py-0.5"

              >
                {item.name}
              </option>
            ))}

          </select>
          {errors.roleId?.message && (
            <p className="text-xs text-red-400">
              {errors.roleId.message.toString()}
            </p>
          )}
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Personal
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NIM"
            name="nim"
            defaultValue={data?.nim}
            register={register}
            error={errors?.nim}
            required={true}
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
            label="Tahun Mendaftar"
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
              -- Pilih Program Studi
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
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Dosen Wali</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lecturerId")}
            defaultValue={data?.lecturerId}
          >
            <option value={""} className="text-sm py-0.5">
              -- Pilih perwalian akademik
            </option>
            {lecturer.map((item: any) => (
              <option
                value={item.id}
                key={item.id}
                className="text-sm py-0.5"

              >
                {item.name}
              </option>
            ))}
          </select>
          {errors.lecturerId?.message && (
            <p className="text-xs text-red-400">
              {errors.lecturerId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Status Registrasi"
            name="statusRegister"
            defaultValue={data?.statusRegister}
            register={register}
            error={errors?.statusRegister}
            required={true}
          />
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
              -- Pilih Gender
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
              -- Pilih Agama
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
        <div className="flex flex-col gap-2 w-full md:w-5/8">
          <InputField
            label="Alamat"
            name="address"
            defaultValue={data?.address}
            register={register}
            error={errors?.address}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Ortu/Wali Mahasiswa
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nama Ayah"
            name="fatherName"
            defaultValue={data?.fatherName}
            register={register}
            error={errors?.fatherName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nama Ayah"
            name="fatherName"
            defaultValue={data?.fatherName}
            register={register}
            error={errors?.fatherName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nama Ibu Kandung"
            name="motherName"
            defaultValue={data?.motherName}
            register={register}
            error={errors?.motherName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nama Wali Mahasiswa"
            name="guardianName"
            defaultValue={data?.guardianName}
            register={register}
            error={errors?.guardianName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="No. Hp Wali Mahasiswa"
            name="guardianHp"
            defaultValue={data?.guardianHp}
            register={register}
            error={errors?.guardianHp}
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

export default StudentForm;