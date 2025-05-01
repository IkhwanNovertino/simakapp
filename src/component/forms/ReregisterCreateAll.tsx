// Form ini digunakan untuk menambahkan mahasiswa ke daftar herregistrasi
"use client";

import { reregisterCreateAll } from "@/lib/action";
import { ReregistrationCreateAllInputs, reregistrationCreateAllSchema, ReregistrationInputs, reregistrationSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ReregistrationFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser";
  data?: any;
  relatedData?: any;
}

const ReregisterCreateAll = ({ setOpen, type, data, relatedData }: ReregistrationFormProps) => {
  console.log(data);

  const [state, formAction] = useActionState(reregisterCreateAll, { success: false, error: false });

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(`Berhasil ${type === "create" ? "menambahkan" : "mengubah"} data mahasiswa`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])
  return (
    <form action={formAction} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Manambahkan data mahasiswa</h1>

      <div className="flex justify-center flex-wrap gap-4">
        <input type="string | number" name="id" value={data?.id} readOnly hidden />
        <div className="flex flex-col gap-2 w-full md:w-full">
          Data mahasiswa akan ditambahkan pada {data?.name}
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">something went wrong!</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default ReregisterCreateAll;