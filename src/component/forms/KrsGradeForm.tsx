"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import InputField from "../InputField";
import { KrsGradeInputs, krsGradeSchema, PositionInputs, positionSchema } from "@/lib/formValidationSchema";
import { createPosition, updateKrsGrade, updatePosition } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormProps } from "@/lib/datatype";
import { getFinalScore, getGradeLetter } from "@/lib/utils";


const KrsGradeForm = ({ setOpen, type, data }: FormProps) => {

  console.log('KRSGRADEFORM', data);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<KrsGradeInputs>({
    resolver: zodResolver(krsGradeSchema),
    defaultValues: {
      id: data?.id || "",
      studentName: data?.krs?.student?.name || "",
      studentNIM: data?.krs?.student?.nim || "",
      finalScore: data?.finalScore || 0,
      gradeLetter: data?.gradeLetter || "",
      weight: data?.weight || 0,
      krsGrade: data?.krsGrade || [],
    }
  })
  const { fields } = useFieldArray({ control, name: "krsGrade" })
  const krsGradeWatch = useWatch({ control, name: "krsGrade" });

  // const action = type === "create" ? createPosition : updatePosition;
  const [state, formAction] = useActionState(updateKrsGrade, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    let finalscore = getFinalScore(krsGradeWatch);

    setValue("finalScore", finalscore.finalScore);
    setValue("gradeLetter", finalscore.gradeLetter);
    setValue("weight", finalscore.gradeWeight);
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type, krsGradeWatch, setValue])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{"Tambahkan Data Nilai Mata Kuliah"}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="visible w-full">
            <InputField
              label="id"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors?.id}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-3/5">
          <InputField
            label="Nama Mahasiswa"
            name="studentName"
            register={register}
            inputProps={{ readOnly: true }}
            error={errors?.studentName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/6">
          <InputField
            label="NIM"
            name="studentNIM"
            register={register}
            inputProps={{ readOnly: true }}
            error={errors?.studentNIM}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Komponen Penilaian
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full">
          {fields.map((field, index) => (
            <div key={field.id} className="flex justify-start flex-wrap gap-4">
              <div className="hidden">
                <InputField
                  label={`ID Komponen ${field.assessmentDetail?.grade?.name || ""}`}
                  name={`krsGrade.${index}.id`}
                  defaultValue={field.id}
                  register={register}
                  error={errors?.krsGrade?.[index]?.id}
                  inputProps={{ readOnly: true }}
                />
              </div>
              <div className="w-3/6">
                <InputField
                  label={`Nilai ${field.assessmentDetail?.grade?.name || ""}`}
                  name={`krsGrade.${index}.score`}
                  register={register}
                  inputProps={{ inputMode: "numeric", onInput: (e: any) => e.target.value = e.target.value.replace(/[^0-9.]/g, '') }}
                  error={errors?.krsGrade?.[index]?.score}
                  required
                />
              </div>
              <div className="w-1/6">
                <InputField
                  label="Persentase"
                  type="number"
                  name={`krsGrade.${index}.percentage`}
                  register={register}
                  inputProps={{ readOnly: true }}
                  error={errors?.krsGrade?.[index]?.percentage}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Penilaian Akhir
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="w-4/12">
          {/* <InputField
            label="Nilai Angka"
            name="finalScore"
            register={register}
            inputProps={{ inputMode: "decimal", onInput: (e: any) => e.target.value = e.target.value.replace(/[^0-9.]/g, '') }}
            error={errors?.finalScore}
            required
          /> */}
          <label className={"text-xs text-gray-500 after:content-['_(*)'] after:text-red-400"}>{"Nilai Akhir"}</label>
          <input
            type="text"
            {...register("finalScore")}
            inputMode="decimal"
            onInput={(e: any) => e.target.value = e.target.value.replace(/[^0-9.]/g, '')}
            onChange={(e) => {
              const value = e.target.value;
              const gradeLetter = getGradeLetter(Number(value));
              setValue("gradeLetter", gradeLetter[0]);
              setValue("weight", gradeLetter[1]);
            }}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full disabled:text-gray-800 disabled:ring-gray-500 disabled:bg-gray-200"
          />
          {errors?.finalScore?.message && (
            <p className="text-xs text-red-400">{errors?.finalScore?.message.toString()}</p>
          )}
        </div>
        <div className="w-4/12">
          <InputField
            label="Nilai Huruf"
            name="gradeLetter"
            register={register}
            inputProps={{ readOnly: true }}
            error={errors?.gradeLetter}
            required
          />
        </div>
        <div className="w-3/12">
          <InputField
            label="Bobot"
            name="weight"
            register={register}
            inputProps={{ readOnly: true, inputMode: "decimal", onInput: (e: any) => e.target.value = e.target.value.replace(/[^0-9.]/g, '') }}
            error={errors?.weight}
            required
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {"Simpan"}
      </button>
    </form >
  )
}

export default KrsGradeForm;