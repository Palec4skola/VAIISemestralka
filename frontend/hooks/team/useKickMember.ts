"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function useKickMember(teamId: string, onSuccess?: () => Promise<void> | void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const kick = async (memberId: number) => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Nie si prihlásený.");
      setLoading(false);
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/teams/${teamId}/kick/${memberId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
