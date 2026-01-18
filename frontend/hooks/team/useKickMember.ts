"use client";

import { apiClient } from "@/lib/apiClient";
import { useState } from "react";

export function useKickMember(teamId: string, onSuccess?: () => Promise<void> | void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const kick = async (memberId: number) => {
    setLoading(true);
    setError("");

    try {
      const res = await apiClient(`/teams/${teamId}/kick/${memberId}`, {
        method: "POST",
      });

      if (!res.ok) {
        setError(await res.text());
        return false;
      }

      if (onSuccess) await onSuccess();
      return true;
    } catch {
      setError("Server nie je dostupný");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { kick, loading, error };
}
