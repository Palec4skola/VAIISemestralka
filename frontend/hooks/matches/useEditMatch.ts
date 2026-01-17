"use client";

import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type { MatchDetailDto, MatchUpdateDto } from "@/types/match";

function toDatetimeLocal(iso: string) {
  // "2026-03-01T15:00:00Z" -> "2026-03-01T16:00" (podla local tz)
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function useEditMatchForm(matchId: number) {
  const [form, setForm] = useState<MatchUpdateDto>({
    date: "",
    location: "",
    opponent: "",
    result: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load detail (na predvyplnenie)
  useEffect(() => {
    if (!Number.isFinite(matchId) || matchId <= 0) return;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient(`/api/matches/${matchId}`);
        if (!res.ok) throw new Error((await res.text().catch(() => "")) || `Load failed (${res.status})`);

        const data = (await res.json()) as MatchDetailDto;

        setForm({
          date: toDatetimeLocal(data.date),
          location: data.location ?? "",
          opponent: data.opponent ?? "",
          result: data.result ?? "",
        });
      } catch {
        setError( "Nepodarilo sa načítať zápas.");
      } finally {
        setLoading(false);
      }
    })();
  }, [matchId]);

  const updateField = (name: keyof MatchUpdateDto, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...form,
        date: new Date(form.date).toISOString(),
      };

      const res = await apiClient(`/api/matches/${matchId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error((await res.text().catch(() => "")) || `Save failed (${res.status})`);
      return true;
    } catch {
      setError("Nepodarilo sa uložiť zmeny.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return useMemo(
    () => ({ form, updateField, loading, saving, error, submit }),
    [form, loading, saving, error]
  );
}
