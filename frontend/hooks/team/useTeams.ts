import { useEffect, useState } from "react";
import { Team } from "@/types/team";
import { apiClient } from "@/lib/apiClient";

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
  const load = async () => {
    try {
      const res = await apiClient("/teams");

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setTeams(await res.json());
    } catch {
      setError("Server nie je dostupný");
    }
  };

  load();
}, []);
  const deleteTeam = async (id: number) => {
    if (!confirm("Naozaj chceš odstrániť tento tím?")) return;

    try {
      const res = await apiClient(`/teams/${id}`, {
        method: "DELETE"
      });

      if (!res.ok && res.status !== 204) {
        setError(await res.text());
        return;
      }

      setTeams((prev) => prev.filter((t) => t.teamId !== id));
    } catch {
      setError("Server nie je dostupný");
    }
  };

  return { teams, error, deleteTeam };
}
