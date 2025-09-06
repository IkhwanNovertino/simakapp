import { renderToBuffer } from "@react-pdf/renderer";
import { RenderPdfProps } from "./datatype";
import AssessmentPdf from "@/component/generatePdf/AssessmentPdf";
import KrsPdf from "@/component/generatePdf/KrsPdf";
import KhsPdf from "@/component/generatePdf/khsPdf";
import ReregisterPdf from "@/component/generatePdf/ReregisterPdf";
import CourseKrsPdf from "@/component/generatePdf/CourseKrsPdf";
import StudentRegisteredKrsPdf from "@/component/generatePdf/StudentRegisteredKrsPdf";
import StudentUnregisteredKrsPdf from "@/component/generatePdf/StudentUnregisteredKrsPdf";
import StudentTakingThesisPdf from "@/component/generatePdf/StudentTakingThesisPdf";
import StudentTakingIntershipPdf from "@/component/generatePdf/StudentTakingIntershipPdf";
import StudentExtendingThesisPdf from "@/component/generatePdf/StudentExtendingThesisPdf";
import StudentActiveInactivePdf from "@/component/generatePdf/StudentActiveInactivePdf";
import StudentRegularSorePdf from "@/component/generatePdf/StudentRegularSorePdf";

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
    case "studentsUnregisteredKrs":
      return await renderToBuffer(StudentUnregisteredKrsPdf({ data }));
    case "studentsTakingThesis":
      return await renderToBuffer(StudentTakingThesisPdf({ data }));
    case "studentsExtendingThesis":
      return await renderToBuffer(StudentExtendingThesisPdf({ data }));
    case "studentsTakingInternship":
      return await renderToBuffer(StudentTakingIntershipPdf({ data }));
    case "studentActiveInactive":
      return await renderToBuffer(StudentActiveInactivePdf({ data }));
    case "studentsRegularSore":
      return await renderToBuffer(StudentRegularSorePdf({ data }));
    default:
      break;
  }

  
};

export default renderPdf;