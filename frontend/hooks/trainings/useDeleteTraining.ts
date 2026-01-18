"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";

export function useDeleteTraining() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remove = async (trainingId: number) => {
    if (!Number.isFinite(trainingId) || trainingId <= 0) {
      setError("Neplatné ID tréningu.");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiClient(`/trainings/${trainingId}`, { method: "DELETE" });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setError(text || "Nepodarilo sa zmazať tréning.");
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

  return { remove, loading, error };
}
