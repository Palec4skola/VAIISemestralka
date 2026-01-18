"use client";

import { useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { getUserIdFromToken } from "@/lib/jwt";
import { AttendanceStatus } from "@/types/attendance";
import { useEventAttendance } from "@/hooks/attendance/useEventAttendance";
import { useAddAttendance } from "@/hooks/attendance/useAddAttendance";
import EventAttendanceTable from "@/components/attendance/EventAttendanceTable";

type EventType = "Training" | "Match";

type Props = {
  title?: string;          // napr. "Dochádzka"
  eventType: EventType;    // "Training" | "Match"
  eventId: number;
  isCoach: boolean;
};

export default function EventAttendanceSection({
  title = "Dochádzka",
  eventType,
  eventId,
  isCoach,
}: Props) {
  const myUserId = useMemo(() => getUserIdFromToken(), []);
  const attendance = useEventAttendance(eventType, eventId);
  const upsert = useAddAttendance();

  const handleSave = async (
    userId: number,
    status: AttendanceStatus,
    reason?: string
  ) => {
    const ok = await upsert.upsert({
      eventType,
      eventId,
      status,
      absenceReason: status === "Absent" ? (reason ?? "") : "",
      userId: isCoach ? userId : undefined, // player neposiela userId
    });

    if (ok) await attendance.refetch();
  };

  return (
    <>
      <h2 className="h5 mb-3">{title}</h2>

      {attendance.loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner size="sm" />
          <span>Načítavam dochádzku…</span>
        </div>
      )}

      {!attendance.loading && (
        <EventAttendanceTable
          items={attendance.items}
          isCoach={isCoach}
          myUserId={myUserId}
          saving={upsert.loading}
          error={attendance.error || upsert.error}
          onSave={handleSave}
        />
      )}
    </>
  );
}
