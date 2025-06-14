"use client";

import { updateKrsDetail } from "@/lib/action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

type FormCourseKrs = {
  id?: string,
  isAcc?: string,
};

const FormCourseKrs = ({ id, isAcc }: FormCourseKrs) => {
  const [state, formAction, pending] = useActionState(updateKrsDetail, { success: false, error: false, message: "" })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
    }
  }, [state, router, id])
  return (
    <form action={formAction}>
      <input type="text | number" name="id" value={id} readOnly hidden />
      <input type="text" name="isAcc" value={isAcc} readOnly hidden />
      <button
        disabled={pending}
        className={`w-7 h-7 flex items-center justify-center rounded-full bg-ternary ${pending && 'disabled:bg-ternary/30 disabled:cursor-none'}`}
      >
        <Image src="/icon/check.svg" alt="" width={22} height={22} />
      </button>
    </form>
  )
}

export default FormCourseKrs;