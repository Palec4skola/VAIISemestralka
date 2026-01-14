import { useEffect, useState } from "react";
import {Team} from "@/types/team";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState("");


  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/teams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setTeams(await res.json());
    } catch {
      setError("Server nie je dostupný");
    }
  };

useEffect(() => {
  (async () => {
    await fetchTeams();
  })();
}, []);
  const deleteTeam = async (id: number) => {
    if (!confirm("Naozaj chceš odstrániť tento tím?")) return;

    try {
      const res = await fetch(`${API_URL}/teams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok && res.status !== 204) {
        setError(await res.text());
        return;
      }

      setTeams(prev => prev.filter(t => t.teamId !== id));
    } catch {
      setError("Server nie je dostupný");
    }
  };

  return { teams, error, deleteTeam };
}
    