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

interface ReregiterCreateOneFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany";
  data?: any;
  relatedData?: any;
}

const ReregiterCreateOneForm = ({ setOpen, type, data, relatedData }: ReregiterCreateOneFormProps) => {
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data herregistrasi mahasiswa baru" : "Ubah data herregister mahasiswa"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Mahasiswa
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="visible">
            <InputField
              label="reregisterId"
              name="reregisterId"
              defaultValue={data?.reregisterId || data?.idReregister}
              register={register}
              error={errors?.id}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Mahasiswa</label>
          <Controller
            name="studentId"
            control={control}
            defaultValue={data?.studentId || ""}
            render={({ field }) => (
              <Select
                {...field}
                options={students.map((student: any) => ({
                  value: student.id,
                  label: `${student.nim} - ${student.name}`,
                }))}
                isClearable
                placeholder="-- Pilih Mahasiswa"
                classNamePrefix="react-select"
                isDisabled={type === "update" && true}
                className="text-sm rounded-md"
                onChange={(selected: any) => {
                  const selectedStudent = students.find((s: any) => s.id === selected?.value);
                  field.onChange(selected ? selected.value : "");
                  if (selectedStudent) {
                    const studentYear: number = selectedStudent?.year;
                    const currentReregisterYear: number = data?.year;
                    const currentReregisterSemesterType: number = data.period?.semesterType === "GANJIL" ? 1 : 0;
                    const semesterInt = (currentReregisterYear - studentYear) * 2 + currentReregisterSemesterType
                    console.log(currentReregisterSemesterType, currentReregisterYear, studentYear, semesterInt);

                    setValue("year", studentYear.toString());
                    setValue('semester', semesterInt.toString());
                    setValue("major", selectedStudent.major?.name?.toString());
                    setValue("lecturerId", selectedStudent?.lecturerId)
                  } else {
                    setValue("year", "");
                    setValue("semester", "");
                    setValue("major", "")
                  }
                }}
                value={
                  students
                    .map((student: any) => ({
                      value: student.id,
                      label: `${student.nim} - ${student.name}`,
                    }))
                    .find((option: any) => option.value === field.value) || null
                }
              />
            )}
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
          <label className="text-xs text-gray-500">Perwalian Akademik</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lecturerId")}
            defaultValue={data?.student?.lecturerId}
          >
            <option
              value={""} key={""}
              className="text-sm py-0.5 capitalize"
            >
              -- Pilih Dosen Wali
            </option>
            {lecturers.map((lecturer: any) => (
              <option
                value={lecturer.id} key={lecturer.id}
                className="text-sm py-0.5 capitalize"
              >
                {lecturer.name}
              </option>
            ))}
          </select>
          {errors.semesterStatus?.message && (
            <p className="text-xs text-red-400">
              {errors.semesterStatus.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Status Herregistrasi</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("semesterStatus")}
            defaultValue={data?.semesterStatus}
          >
            <option
              value={""} key={""}
              className="text-sm py-0.5 capitalize"
            >
              -- Status Herregistrasi
            </option>
            <option
              value={"NONAKTIF"} key={"NONAKTIF"}
              className="text-sm py-0.5 capitalize"
            >
              NONAKTIF
            </option>
            <option
              value={"AKTIF"} key={"AKTIF"}
              className="text-sm py-0.5 capitalize"
            >
              AKTIF
            </option>
            <option
              value={"CUTI"} key={"CUTI"}
              className="text-sm py-0.5 capitalize"
            >
              CUTI
            </option>
            <option
              value={"MENGUNDURKAN_DIRI"} key={"MENGUNDURKAN_DIRI"}
              className="text-sm py-0.5 capitalize"
            >
              MENGUNDURKAN DIRI
            </option>
            <option
              value={"DO"} key={"DO"}
              className="text-sm py-0.5 capitalize"
            >
              DO
            </option>
            <option
              value={"LULUS"} key={"LULUS"}
              className="text-sm py-0.5 capitalize"
            >
              LULUS
            </option>
          </select>
          {errors.lecturerId?.message && (
            <p className="text-xs text-red-400">
              {errors.lecturerId.message.toString()}
            </p>
          )}
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
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Informasi Pembayaran Herregistrasi
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nominal"
            name="nominal"
            defaultValue={data?.nominal}
            register={register}
            error={errors?.nominal}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Status Pembayaran</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            size={2}
            {...register("paymentStatus")}
            defaultValue={data?.paymentStatus}
          >
            <option
              value={"BELUM_LUNAS"} key={"BELUM_LUNAS"}
              className="text-sm py-0.5 capitalize"
            >
              BELUM LUNAS
            </option>
            <option
              value={"LUNAS"} key={"LUNAS"}
              className="text-sm py-0.5 capitalize"
            >
              LUNAS
            </option>
          </select>
          {errors.paymentStatus?.message && (
            <p className="text-xs text-red-400">
              {errors.paymentStatus.message.toString()}
            </p>
          )}
        </div>
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Informasi Form Herregistrasi
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Nama Orang Tua/Wali"
            name="guardianName"
            defaultValue={data?.student?.lecturerId}
            register={register}
            error={errors?.lecturerId}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="NIK Orang Tua/Wali"
            name="guardianID"
            defaultValue={data?.student?.lecturerId}
            register={register}
            error={errors?.guardianID}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Pekerjaan Orang Tua/Wali"
            name="guardianJob"
            defaultValue={data?.student?.lecturerId}
            register={register}
            error={errors?.guardianJob}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="No. Telp/HP Orang Tua/Wali"
            name="guardianHP"
            defaultValue={data?.student?.lecturerId}
            register={register}
            error={errors?.guardianHP}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12 mb-8">
          <label className="text-xs text-gray-500">Alamat Orang Tua/Wali</label>
          <textarea
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Alamat"
          ></textarea>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="Nama Gadis Ibu Kandung"
            name="motherName"
            defaultValue={data?.student?.lecturerId}
            register={register}
            error={errors?.motherName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="NIK Ibu Kandung"
            name="motherID"
            defaultValue={data?.student?.lecturerId}
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

export default ReregiterCreateOneForm;