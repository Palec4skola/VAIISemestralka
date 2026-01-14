"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";

export type CreateTrainingInput = {
  teamId: number;
  dateIsoUtc: string;     
  location: string;
  description: string;
};

export function useCreateTraining() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const create = async (input: CreateTrainingInput) => {
    setLoading(true);
    setError("");

    try {
      const res = await apiClient(`/trainings/${input.teamId}`, {
        method: "POST",
        body: JSON.stringify({
          date: input.dateIsoUtc,
          location: input.location,
          description: input.description,
        }),
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

  return { create, loading, error, setError };
}
