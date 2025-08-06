import { Dispatch, SetStateAction } from "react";

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
  | "krs"
  | "krsDetail"
  | "khsGrade"
  | "rpl"
  | "class"
  | "classDetail"
  | "time"
  | "schedule"
  | "scheduleDetail"
  | "presence"
  | "presenceDetail"
  | "presenceAll";

  type: "create" | "update" | "delete" | "createUser" | "updateUser" | "createMany" | "presenceActive" | "presenceNon";
  label?: string,
  data?: any;
  id?: any;
}

export interface FormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany" | "presenceActive" | "presenceNon";
  data?: any;
  relatedData?: any;
}