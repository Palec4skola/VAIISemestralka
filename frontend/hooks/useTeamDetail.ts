import { useEffect, useState } from "react";
import { Team } from "@/types/team";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function useTeamDetail(teamId: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError(await res.text());
          return;
        }

        setTeam(await res.json());
      } catch {
        setError("Server nie je dostupný");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  return { team, error, loading };
}
  