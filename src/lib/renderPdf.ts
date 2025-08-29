import { renderToBuffer } from "@react-pdf/renderer";
import { RenderPdfProps } from "./datatype";
import AssessmentPdf from "@/component/generatePdf/AssessmentPdf";
import KrsPdf from "@/component/generatePdf/KrsPdf";
import KhsPdf from "@/component/generatePdf/khsPdf";
import ReregisterPdf from "@/component/generatePdf/ReregisterPdf";
import CourseKrsPdf from "@/component/generatePdf/CourseKrsPdf";
import StudentRegisteredKrsPdf from "@/component/generatePdf/StudentRegisteredKrsPdf";

const renderPdf  = async ({ type, data }: RenderPdfProps) : Promise<Buffer | undefined> => {
  // let pdfContent: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
  switch (type) {
    case "assessment":
      return await renderToBuffer(AssessmentPdf({ data }));
    case "krs":
      return await renderToBuffer(KrsPdf({ data }));
    case "khs":
      return await renderToBuffer(KhsPdf({ data }));
    case "reregister":
      return await renderToBuffer(ReregisterPdf({ data }));
    case "coursekrs":
      return await renderToBuffer(CourseKrsPdf({ data }));
    case "studentsRegisteredKrs":
      return await renderToBuffer(StudentRegisteredKrsPdf({ data }));
    default:
      break;
  }

  
};

export default renderPdf;