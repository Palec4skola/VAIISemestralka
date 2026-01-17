import { AttendanceStatus } from "./attendance";
export type TrainingListItem = {
  id: number;
  date: string;        
  location: string;
  description: string;
  teamId: number;
  name: string;
};
export type TrainingDetail = {
  id: number;
  date: string; // ISO
  location: string;
  description: string;
  teamId: number;
  name: string;
  role: "Coach" | "Player" | string;
  myAttendanceStatus?: string | null;   // napr. "Present" | "Absent" | null
  myAbsenceReason?: string | null;
};

export type TrainingsMode = "all" | "upcoming";

export type AttendanceRow = {
  userId: number;
  name: string;
  email?: string;
  status?: AttendanceStatus | null;
  absenceReason?: string | null;
};
export type TrainingUpdateDto = {
  date: string;        
  location: string;
  description?: string | null;
};

