"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";

export function useDeleteMatch() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMatch = async (id: number) => {
    setDeleting(true);
    setError(null);

    try {
      const res = await apiClient(`/matches/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Delete failed (${res.status})`);
      }

      return true;
    } catch  {
      setError("Nepodarilo sa zmazať zápas.");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { deleteMatch, deleting, error };
}
