"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { CourseInKrsInputs, CourseInKrsSchema } from "@/lib/formValidationSchema";
import { createKrsDetail } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


interface KrsDetailFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany";
  data?: any;
  relatedData?: any;
}

type courseDataTypeInKrs = {
  id: string,
  code: string,
  name: string,
  sks: number | string,
  semester: number | string,
}[];

const KrsDetailForm = ({ setOpen, type, data, relatedData }: KrsDetailFormProps) => {
  const { course } = relatedData;
  // console.log(data?.krsDetail.map((item: any) => item.courseId));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CourseInKrsInputs>({
    resolver: zodResolver(CourseInKrsSchema),
    defaultValues: {
      // course: data?.krsDetail.map((item: any) => (
      //   { id: item.courseId, code: item.course.code, name: item.course.name, sks: item.course.sks }
      // )) || [],
      course: [],
    },
  })
  const [state, formAction] = useActionState(createKrsDetail, { success: false, error: false, message: "" });

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
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Daftar Mata Kuliah</h1>
          <h3 className="text-xs font-medium text-yellow-500">Pilih Mata Kuliah tidak lebih dari maksimal SKS yang ditentukan</h3>
        </header>

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
        </div>
        <div className="flex flex-col justify-between flex-wrap">
          <Controller
            name="course"
            control={control}
            render={({ field }) => (
              <>
                {course.map((course: any) => (
                  <div key={course.id} className="odd:bg-gray-200 p-4">
                    <label className="grid grid-cols-12">
                      <input
                        type="checkbox"
                        className="max-w-4 max-h-4 place-items-start"
                        value={course.id}
                        checked={field.value?.some((v: any) => v.id === course.id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          let newValue;
                          if (isChecked) {
                            newValue = [...(field.value || []), course];
                          } else {
                            newValue = (field.value || []).filter((v: any) => v.id !== course.id);
                          }
                          field.onChange(newValue);
                        }}
                      />
                      <div className="col-span-11">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 justify-items-stretch">
                          <div className="text-sm col-span-2">{course.code}</div>
                          <div className="text-sm col-span-7">{course.name}</div>
                          <div className="text-sm">{course.sks} SKS</div>
                          <div className="text-sm col-span-2">Semester {course.semester}</div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </>
            )}
          />
          {errors.course && (
            <p className="text-red-400 text-xs">{errors.course.message}</p>
          )}
        </div>
        {state?.error && (<span className="text-xs text-red-400">{state?.message}</span>)}

        <button className="bg-blue-400 text-white p-2 rounded-md">
          {"Tambah"}
        </button>
      </form >
    </>
  )
}

export default KrsDetailForm;