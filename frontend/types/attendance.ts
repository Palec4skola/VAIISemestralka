export type AttendanceStatus = "Present" | "Absent";

export type AttendanceItem = {
  userId: number;
  name: string;
  email: string;
  status: AttendanceStatus | null;
  absenceReason: string | null;
};
