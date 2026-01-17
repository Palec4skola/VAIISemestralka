"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type { MatchDetailDto, MatchUpdateDto } from "@/types/match";
import {useRouter} from "next/navigation";

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function useEditMatch(id: string) {
  const matchId = Number(id);
  const router = useRouter();

  const [match, setMatch] = useState<MatchDetailDto | null>(null);
  const [form, setForm] = useState<MatchUpdateDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    if (!Number.isFinite(matchId) || matchId <= 0) {
      setError("Neplatné ID zápasu.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiClient(`/matches/${matchId}`);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Load failed (${res.status})`);
      }

      const data = (await res.json()) as MatchDetailDto;
      setMatch(data);

      setForm({
        date: toDatetimeLocal(data.date),
        location: data.location ?? "",
        opponent: data.opponent ?? "",
        result: data.result ?? "",
      });
    } catch  {
      setError("Nepodarilo sa načítať zápas.");
      setMatch(null);
      setForm(null);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = (field: keyof MatchUpdateDto, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const submit = async () => {
    if (!form) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        date: new Date(form.date).toISOString(),
        location: form.location.trim(),
        opponent: form.opponent.trim(),
        result: form.result.trim(), // "" je ok
      };

      const res = await apiClient(`/matches/${matchId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Save failed (${res.status})`);
      }

      setSuccess("Zmeny boli uložené.");
      router.push(`/matches`);
    } catch {
      setError("Nepodarilo sa uložiť zmeny.");
    } finally {
      setSaving(false);
    }
  };

  return { match, form, loading, saving, error, success, updateField, submit };
}
