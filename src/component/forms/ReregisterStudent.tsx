"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { reregistrationDetail, ReregistrationDetailInputs } from "@/lib/formValidationSchema";
import { createReregisterDetail, updateReregisterDetail } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Select from "react-select";

interface ReregisterStudentFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany";
  data?: any;
  relatedData?: any;
}

const ReregisterStudentForm = ({ setOpen, type, data, relatedData }: ReregisterStudentFormProps) => {
  const { students, lecturers } = relatedData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<ReregistrationDetailInputs>({
    resolver: zodResolver(reregistrationDetail)
  })


  const action = type === "create" ? createReregisterDetail : updateReregisterDetail;
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
      <h1 className="text-xl font-semibold">{`Data Herregistrasi ${data?.reregister?.period?.name}`}</h1>
      <div className="w-full py-4 bg-amber-300 rounded-md flex flex-col items-center">
        <span className="font-semibold">
          Harap Memperhatikan data yang diisi. Data hanya dapat diisi satu kali.
        </span>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Mahasiswa
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="hidden">
            <InputField
              label="reregisterId"
              name="reregisterId"
              defaultValue={data?.reregisterId || data?.idReregister}
              register={register}
              error={errors?.id}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NIM"
            name="nim"
            defaultValue={data?.student?.nim}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.year}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-8/12">
          <InputField
            label="Nama Mahasiswa"
            name="name"
            defaultValue={data?.student?.name}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.year}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Angkatan"
            name="year"
            defaultValue={data?.student?.year}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.year}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Semester"
            name="semester"
            defaultValue={data?.semester}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.semester}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Program Studi"
            name="major"
            defaultValue={data?.student?.major?.name}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.major}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lokasi</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("campusType")}
            defaultValue={data?.campusType}
          >
            <option
              value={""} key={""}
              className="text-sm py-0.5 capitalize"
            >
              -- Pilih Kampus
            </option>
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
          {errors.campusType?.message && (
            <p className="text-xs text-red-400">
              {errors.campusType.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-8/12">
          <InputField
            label="Perwalian Akademik"
            name="lecturerId"
            defaultValue={data?.student?.lecturer?.name}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.lecturerId}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Mahasiswa
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Tempat Lahir"
            name="birthOfPlace"
            register={register}
            error={errors?.lecturerId}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Tanggal Lahir"
            name="birthday"
            register={register}
            error={errors?.lecturerId}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="No. Telp/HP"
            name="hp"
            defaultValue={data?.student?.hp || "No. Telp/HP"}
            register={register}
            error={errors?.lecturerId}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Email"
            name="lecturerId"
            defaultValue={data?.student?.email || "email"}
            register={register}
            error={errors?.lecturerId}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Alamat Asal/Domisili</label>
          <textarea
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Alamat"
          ></textarea>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Alamat Sekarang</label>
          <textarea
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Alamat"
          ></textarea>
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Orang Tua/Wali
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Nama Orang Tua/Wali"
            name="guardianName"
            register={register}
            error={errors?.lecturerId}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="NIK Orang Tua/Wali"
            name="guardianID"
            register={register}
            error={errors?.guardianID}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Pekerjaan Orang Tua/Wali"
            name="guardianJob"
            register={register}
            error={errors?.guardianJob}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="No. Telp/HP Orang Tua/Wali"
            name="guardianHP"
            register={register}
            error={errors?.guardianHP}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Alamat Orang Tua/Wali</label>
          <textarea
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Alamat"
          ></textarea>
        </div>

      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Ibu Kandung
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="Nama Gadis Ibu Kandung"
            name="motherName"
            register={register}
            error={errors?.motherName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="NIK Ibu Kandung"
            name="motherID"
            register={register}
            error={errors?.motherID}
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

export default ReregisterStudentForm;