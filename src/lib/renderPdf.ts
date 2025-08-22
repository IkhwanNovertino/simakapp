import { renderToBuffer } from "@react-pdf/renderer";
import { RenderPdfProps } from "./datatype";
import AssessmentPdf from "@/component/generatePdf/AssessmentPdf";
import React from "react";

const renderPdf  = async ({ type, data }: RenderPdfProps) : Promise<Buffer | undefined> => {
  // let pdfContent: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
  switch (type) {
    case "assessment":
      return await renderToBuffer(AssessmentPdf({ data }));
    default:
      break;
  }

  
};

export default renderPdf;