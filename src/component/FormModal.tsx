"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Dispatch, JSX, SetStateAction, useState } from "react";

export interface FormModalProps {
  table: "permission";
  type: "create" | "update" | "delete";
  data?: any;
  id?: any;
}

const PermissionForm = dynamic(() => import("./forms/PermissionForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any,
  ) => JSX.Element;
} = {
  permission: (setOpen, type, data, relatedData) => <PermissionForm setOpen={setOpen} type={type} data={data} relatedData={relatedData} />,
}

const FormModal = ({ table, type, data, id, relatedData }: FormModalProps & { relatedData?: any }) => {


  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = (type === "create" && "bg-secondary") || (type === "update" && "bg-ternary") || (type === "delete" && "bg-accent");
  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "delete" && id ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    )
  }

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt={`icon-${type}`} width={16} height={16} />
      </button>

      {open && (
        <div className="w-full h-screen absolute left-0 top-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src={"/close.png"} alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FormModal;