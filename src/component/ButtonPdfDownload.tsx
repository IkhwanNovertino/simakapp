"use client";

import { ButtonPdfDownloadProps } from "@/lib/datatype";

const ButtonPdfDownload = ({ id, type, label }: ButtonPdfDownloadProps) => {
  return (
    <a
      href={`/api/pdf?u=${id}&type=${type}`}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-primary/70 rounded-full cursor-pointer hover:bg-primary"
    >
      {label ?? "Export .pdf"}
    </a>
  )
}

export default ButtonPdfDownload;