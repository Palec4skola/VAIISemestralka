"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type { TrainingDetail, TrainingUpdateDto } from "@/types/training";
import { useRouter } from "next/navigation";

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function useEditTraining(id: string) {
  const trainingId = Number(id);
  const router = useRouter();

  const [training, setTraining] = useState<TrainingDetail | null>(null);
  const [form, setForm] = useState<TrainingUpdateDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    if (!Number.isFinite(trainingId) || trainingId <= 0) {
      setError("Neplatné ID tréningu.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiClient(`/trainings/${trainingId}/detail`);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Load failed (${res.status})`);
      }

      const data = (await res.json()) as TrainingDetail;
      setTraining(data);

      setForm({
        date: toDatetimeLocal(data.date),
        location: data.location ?? "",
        description: data.description ?? "",
      });
    } catch {
      setError("Nepodarilo sa načítať tréning.");
      setTraining(null);
      setForm(null);
    } finally {
      setLoading(false);
    }
  }, [trainingId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = (field: keyof TrainingUpdateDto, value: string) => {
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
        description: (form.description ?? "").trim(), // "" je ok
      };

      const res = await apiClient(`/trainings/${trainingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Save failed (${res.status})`);
      }

      setSuccess("Zmeny boli uložené.");
      router.push(`/trainings`);
    } catch {
      setError("Nepodarilo sa uložiť zmeny.");
    } finally {
      setSaving(false);
    }
  };

  return { training, form, loading, saving, error, success, updateField, submit };
}
