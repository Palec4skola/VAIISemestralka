"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { TrainingDetail } from "@/types/training";

export function useTrainingDetail(trainingId: string) {
  const [training, setTraining] = useState<TrainingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await apiClient(`/trainings/${trainingId}/detail`);
        if (!res.ok) {
          setError(await res.text());
          return;
        }
        setTraining(await res.json());
      } catch {
        setError("Server nie je dostupný");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [trainingId]);

  return { training, loading, error };
}
