import React, { Dispatch, SetStateAction } from "react";

export interface FormModalProps {
  table: "permission"
  | "role"
  | "operator"
  | "position"
  | "lecturer"
  | "lecturerUser"
  | "operatorUser"
  | "studentUser"
  | "student"
  | "course"
  | "major"
  | "room"
  | "period"
  | "reregistration"
  | "reregistrationCreateAll"
  | "reregistrationDetail"
  | "reregistrationStudent"
  | "curriculum"
  | "curriculumDetail"
  | "grade"
  | "assessment"
  | "krsOverride"
  | "krsDetail"
  | "krsRules"
  | "khsGrade"
  | "khsRevision"
  | "rpl"
  | "class"
  | "classDetail"
  | "time"
  | "schedule"
  | "scheduleDetail"
  | "presence"
  | "presenceDetail"
  | "presenceAll";

  type: "create" | "update" | "delete" | "createUser" | "updateUser" | "createMany" | "presenceActive" | "presenceNon" | "revision";
  label?: string,
  data?: any;
  id?: any;
}

export interface FormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany" | "presenceActive" | "presenceNon" | "revision";
  data?: any;
  relatedData?: any;
}

export type stateType = {
  success: boolean;
  error: boolean;
  message: string;
}

export type PdfType = "reregister"
  | "assessment"
  | "khs"
  | "krs"
  | "transcript"
  | "coursekrs"
  | "studentsRegularSore"
  | "studentActiveInactive"
  | "studentsRegisteredKrs"
  | "studentsUnregisteredKrs" 
  | "studentsTakingThesis" 
  | "studentsExtendingThesis"
  | "studentsTakingInternship";

export type RecapitulationCardType = "studentsRegisteredKrs"
  | "coursekrs"  
  | "studentsRegularSore"
  | "studentActiveInactive"
  | "studentsUnregisteredKrs" 
  | "studentsTakingThesis" 
  | "studentsExtendingThesis"
  | "studentsTakingInternship";

export interface GeneratePdfProps {
  data?: any,
  img?: Buffer | string,
};

export interface ButtonPdfDownloadProps {
  id: string;
  type: PdfType;
  children: React.ReactNode;
};

export interface RenderPdfProps {
  type: PdfType;
  data: any;
}