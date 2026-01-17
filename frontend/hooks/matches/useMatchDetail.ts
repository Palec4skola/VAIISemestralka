"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type { MatchDetailDto } from "@/types/match";

export function useMatchDetail(matchId: number) {
  const [match, setMatch] = useState<MatchDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
        const res = await apiClient(`/matches/${matchId}`);
        if (!res.ok) {
          setError(await res.text());
          return;
        }
        setMatch(await res.json());
      } catch {
        setError("Server nie je dostupný");
      } finally {
        setLoading(false);
      }
  }, [matchId]);

  useEffect(() => {
    if (!Number.isFinite(matchId) || matchId <= 0) return;
    load();
  }, [matchId, load]);

  return { match, loading, error, refresh: load };
}
