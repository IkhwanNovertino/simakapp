"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { LecturerInputs, lecturerSchema, UserInputs, userSchema } from "@/lib/formValidationSchema";
import { createUserStudent } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { degree, gender, religion } from "@/lib/setting";
import Image from "next/image";

interface OperatorUserFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser";
  data?: any;
  relatedData?: any;
}

const OperatorUserForm = ({ setOpen, type, data, relatedData }: OperatorUserFormProps) => {
  const { majors, role } = relatedData;


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInputs>({
    resolver: zodResolver(userSchema)
  })

  // const action = type === "create" ? createLecturerUser : updateLecturer;
  const [state, formAction] = useActionState(createUserStudent, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data mahasiswa`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{"Form Akun pengguna Mahasiswa"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Autentikasi
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Email"
            name="username"
            defaultValue={data?.user?.email}
            register={register}
            error={errors?.username}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Password"
            name="password"
            type="password"
            defaultValue={data?.user?.password}
            register={register}
            error={errors?.password}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Role Pengguna</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("roleId")}
            defaultValue={data?.user?.roleId}
          >
            <option value="" className="text-sm py-0.5">
              -- Pilih role pengguna
            </option>
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
      {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {"Buat Akun Pengguna"}
      </button>
    </form>
  )
}

export default OperatorUserForm;