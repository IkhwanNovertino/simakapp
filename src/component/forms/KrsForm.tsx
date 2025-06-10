"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import InputField from "../InputField";
import { AssessmentInputs, assessmentSchema, KrsInputs, krsSchema } from "@/lib/formValidationSchema";
import { createAssessment, createKRS, updateAssessment, updateKRS } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import Image from "next/image";

interface KrsFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany";
  data?: any;
  relatedData?: any;
}

const KrsForm = ({ setOpen, type, data, relatedData }: KrsFormProps) => {
  const { course, semesterFromReregisterDetail } = relatedData;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<KrsInputs>({
    resolver: zodResolver(krsSchema),
    defaultValues: {
      krsDetail: data?.krsDetail ? [{ courseId: "", isAcc: false }] : data?.krsDetail
    }
  })
  const { fields, remove, append } = useFieldArray({
    control,
    name: "krsDetail",
  })


  const action = type === "create" ? createKRS : updateKRS;
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{"Form Kartu Rencana Studi"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputField
            label="Nama Mahasiswa"
            name="name"
            defaultValue={data?.student?.name}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputField
            label="NIM"
            name="nim"
            defaultValue={data?.student?.nim}
            register={register}
            error={errors?.nim}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputField
            label="Program Studi"
            name="major"
            defaultValue={data?.student?.major?.name}
            register={register}
            error={errors?.major}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputField
            label="Jenjang"
            name="jenjang"
            defaultValue={"S1"}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputField
            label="IPK"
            name="ipk"
            defaultValue={data?.ipk}
            register={register}
            error={errors?.ipk}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputField
            label="max. SKS"
            name="maxSks"
            defaultValue={data?.maxSks}
            register={register}
            error={errors?.maxSks}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputField
            label="Semester"
            name="semester"
            defaultValue={semesterFromReregisterDetail}
            register={register}
            error={errors?.semester}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputField
            label="Tahun Akademik"
            name="period"
            defaultValue={data?.reregister?.period?.name}
            register={register}
            error={errors?.period}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Daftar mata kuliah yang diambil
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap items-center justify-start gap-4">
              <div className="w-full">
                <InputSelect
                  label={`Mata Kuliah ${index + 1}`}
                  name={`krsDetail.${index}.courseId`}
                  options={course.map((item: any) => ({
                    value: item.courseId,
                    label: `Semester ${item.semester} | ${item.course.sks} sks | ${item.course.name}`,
                  }))}
                  control={control}
                  error={errors?.krsDetail?.[index]?.courseId}
                  required
                />
              </div>
              <div className="w-8/12 md:w-4/10 self-end py-2">
                <Controller
                  name={`krsDetail.${index}.isAcc`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2 self-center">
                      <label htmlFor="isActive" className="peer flex items-center justify-start gap-1.5 text-sm text-gray-600 has-checked:text-indigo-900 has-checked:font-medium after:content-['belum_setujui'] has-checked:after:content-['telah_disetujui']">
                        <input
                          id="isActive"
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4"
                        />
                      </label>
                    </div>
                  )}
                />
              </div>
              <div className="w-2/12 md:w-1/10 self-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-slate-100 text-sm bg-red-500 py-2 px-2  rounded-md"
                >
                  <Image src={'/icon/delete.svg'} alt={`icon-delete`} width={18} height={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ courseId: "", isAcc: false })}
          className="text-slate-100 text-sm bg-blue-500 py-2 px-4 rounded-md"
        >
          + Tambah Komponen
        </button>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state?.message}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default KrsForm;