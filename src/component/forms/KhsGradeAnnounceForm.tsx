'use client';

import { updateKhsGradeAnnouncement, updateKhsGradeSubmitted } from "@/lib/action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface TypeKhsGradeAnnounceForm {
  type: "announcement" | "submitted",
  data?: any
}

const KhsGradeAnnounceForm = ({ type, data }: TypeKhsGradeAnnounceForm) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  let action = type === "announcement" ? updateKhsGradeAnnouncement : updateKhsGradeSubmitted;
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });
  console.log('KhsGradeAnnounceForm', data);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, setOpen, router]);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-secondary/70 rounded-full cursor-pointer capitalize hover:bg-secondary`}
      >
        {type === "announcement" ? "umumkan nilai" : "serahkan nilai"}
      </button>

      {open && (
        <div className="w-screen h-screen fixed z-[9999] left-0 top-0 bg-black/60  flex items-start justify-center overflow-scroll">
          <div className="bg-white p-4 relative rounded-md mt-8  w-[88%] md:w-[70%] lg:w-[60%] xl:w-[55%] 2xl:w-[50%] h-fit">
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src={"/close.png"} alt="" width={14} height={14} />
            </div>
            <div>
              <form action={formAction} className="flex flex-col gap-8">
                <h1 className="text-xl font-semibold">{type === "announcement" ? "Umumkan Nilai Mata kuliah" : "Serahkan Nilai Mata kuliah"}</h1>
                <div className="flex justify-between flex-wrap gap-4">
                  <div className="hidden">
                    <label
                      className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                      htmlFor="courseId"
                    >
                      <span>Mata Kuliah ID</span>
                    </label>
                    <input
                      type="text"
                      name="courseId"
                      id="courseId"
                      className="focus-within:border-0 focus:border-0"
                      value={data.course.id}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                      htmlFor="course"
                    >
                      <span>Mata Kuliah</span>
                    </label>
                    <input
                      type="text"
                      name="course"
                      id="course"
                      className="focus-within:border-0"
                      value={`${data.course.code} | ${data.course.name}`}
                      readOnly
                    />
                  </div>
                  <div className="visible">
                    <label
                      className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                      htmlFor="khsDetailId"
                    >
                      <span>KhsDetailId</span>
                    </label>
                    <input
                      type="text"
                      name="khsDetailId"
                      id="khsDetailId"
                      className="focus-within:border-0"
                      value={`${data.khsDetailId}`}
                      readOnly
                    />
                  </div>
                </div>
                {state?.error && (<span className="text-xs text-red-400">{state?.message}</span>)}
                <button className="bg-blue-400 text-white p-2 rounded-md capitalize">
                  {type === "announcement" ? "umumkan nilai" : "serahkan nilai"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default KhsGradeAnnounceForm;