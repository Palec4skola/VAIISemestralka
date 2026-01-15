"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { AttendanceItem } from "@/types/attendance";

export function useEventAttendance(eventType: "Training" | "Match", eventId?: number) {
  const [items, setItems] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError("");

    try {
      const res = await apiClient(`/attendances?eventType=${eventType}&eventId=${eventId}`);
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      setItems(await res.json());
    } catch {
      setError("Server nie je dostupný");
    } finally {
      setLoading(false);
    }
  }, [eventType, eventId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return { items, loading, error, refetch: fetchAttendance, setItems };
}
