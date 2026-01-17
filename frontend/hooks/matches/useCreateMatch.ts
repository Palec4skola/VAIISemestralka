"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";

export function useCreateMatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const create = async (data: {
    teamId: number;
    dateIsoUtc: string;
    location: string;
    opponent: string;
    result: string;
  }) => {
    setLoading(true);
    setError("");

    try {
      const res = await apiClient(`/matches/${data.teamId}`, {
        method: "POST",
        body: JSON.stringify({
          teamId: data.teamId,
          date: data.dateIsoUtc,
          location: data.location,
          opponent: data.opponent,
          result: data.result,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setError(text || `Request failed (${res.status})`);
        return false;
      }

      return true;
    } catch{
      setError("Nepodarilo sa vytvoriť zápas.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
