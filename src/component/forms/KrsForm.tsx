"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { CourseInKrsInputs, CourseInKrsSchema } from "@/lib/formValidationSchema";
import { createKrsDetail } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


interface KrsFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany";
  data?: any;
  relatedData?: any;
}

const KrsForm = ({ setOpen, type, data }: KrsFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseInKrsInputs>({
    resolver: zodResolver(CourseInKrsSchema),
    defaultValues: {
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
        <button className="bg-blue-400 text-white p-2 rounded-md" disabled>
          {"Tambah"}
        </button>
      </form >
    </>
  )
}

export default KrsForm;