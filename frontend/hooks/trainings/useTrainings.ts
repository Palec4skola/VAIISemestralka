"use client";

import { useEffect, useState } from "react";
import { TrainingListItem, TrainingsMode } from "@/types/training";
import { apiClient } from "@/lib/apiClient";

export function useTrainings() {
  const [trainings, setTrainings] = useState<TrainingListItem[]>([]);
  const [mode, setMode] = useState<TrainingsMode>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const endpoint =
          mode === "upcoming" ? "/trainings/upcoming" : "/trainings";

        const res = await apiClient(endpoint);

        if (!res.ok) {
          setError(await res.text());
          setTrainings([]);
          return;
        }

        setTrainings(await res.json());
      } catch {
        setError("Server nie je dostupný");
        setTrainings([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [mode]);

  return { trainings, mode, setMode, loading, error };
}
