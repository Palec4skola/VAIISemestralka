import { useCallback, useEffect, useState } from "react";
import { Team } from "@/types/team";
import { apiClient } from "@/lib/apiClient";

export function useTeamDetail(teamId: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTeam = useCallback(async () => {
    if (!teamId) {
      setTeam(null);
      setError("Neplatné ID tímu.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiClient(`/teams/${teamId}`);

      if (!res.ok) {
        setTeam(null);
        setError(await res.text());
        return;
      }

      setTeam(await res.json());
    } catch {
      setTeam(null);
      setError("Server nie je dostupný");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { team, error, loading, refetch: fetchTeam };
}

  