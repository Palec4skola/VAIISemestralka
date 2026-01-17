"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/apiClient";

export type CalendarItem = {
  id: number;
  date: string;      // ISO
  title: string;
  type: "training" | "match";
  location?: string | null;
};

function startOfMonthUtc(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1, 0, 0, 0));
}

function startOfNextMonthUtc(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0));
}

export function useCalendar(current: Date) {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fromUtc = useMemo(() => startOfMonthUtc(current), [current]);
  const toUtc = useMemo(() => startOfNextMonthUtc(current), [current]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const qs = new URLSearchParams({
        fromUtc: fromUtc.toISOString(),
        toUtc: toUtc.toISOString(),
      });

      const res = await apiClient(`/calendar?${qs.toString()}`);
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
  }, [fromUtc, toUtc]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, reload: load };
}
