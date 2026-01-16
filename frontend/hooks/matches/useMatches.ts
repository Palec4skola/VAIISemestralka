"use client";

import { useCallback, useEffect, useState } from "react";
import type { MatchListItemDto, MatchesMode } from "@/types/match";
import { apiClient } from "@/lib/apiClient";


function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function useMatches() {
  const [matches, setMatches] = useState<MatchListItemDto[]>([]);
  const [mode, setMode] = useState<MatchesMode>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Chýba token. Prihlás sa znova.");

      const endpoint =
        mode === "upcoming" ? `/matches/upcoming` : `/matches`;

      const res = await apiClient(endpoint);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data = (await res.json()) as MatchListItemDto[];
      setMatches(data);
    } catch {
      setMatches([]);
        setError("Nepodarilo sa načítať zápasy.");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    load();
  }, [load]);

  return { matches, mode, setMode, loading, error, refresh: load };
}
