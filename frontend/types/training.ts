import { AttendanceStatus } from "./attendance";
export type TrainingListItem = {
  id: number;
  date: string;        
  location: string;
  description: string;
  teamId: number;
  teamName: string;
};
export type TrainingDetail = {
  id: number;
  date: string; // ISO
  location: string;
  description: string;
  teamId: number;
  teamName: string;
  myRole: "Coach" | "Player" | string;
  myAttendanceStatus?: string | null;   // napr. "Present" | "Absent" | null
  myAbsenceReason?: string | null;
};


export type AttendanceRow = {
  userId: number;
  name: string;
  email?: string;
  status?: AttendanceStatus | null;
  absenceReason?: string | null;
};

