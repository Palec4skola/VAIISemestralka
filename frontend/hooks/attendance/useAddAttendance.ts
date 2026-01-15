"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { AttendanceStatus } from "@/types/attendance";

type UpsertAttendanceInput = {
  eventType: "Training" | "Match";
  eventId: number;
  status: AttendanceStatus;
  absenceReason?: string;
  userId?: number; // coach môže poslať pre iného
};

export function useAddAttendance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upsert = async (input: UpsertAttendanceInput) => {
    setLoading(true);
    setError("");

    try {
      const res = await apiClient("/attendances", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        setError(await res.text());
        return false;
      }

      return true;
    } catch {
      setError("Server nie je dostupný");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { upsert, loading, error };
}
