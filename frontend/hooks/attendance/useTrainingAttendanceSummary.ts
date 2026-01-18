"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

export type AttendanceSummaryRow = {
  userId: number;
  name: string;
  email: string;
  present: number;
  total: number;
};

export function useTrainingAttendanceSummary(teamId: number) {
  const [items, setItems] = useState<AttendanceSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!teamId || teamId <= 0) {
      setItems([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await apiClient(
          `/attendances/summary/trainings?teamId=${teamId}`
        );

        if (!res.ok) {
          setError(await res.text());
          setItems([]);
          return;
        }

        setItems(await res.json());
      } catch {
        setError("Server nie je dostupný");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [teamId]);

  return { items, loading, error };
}
