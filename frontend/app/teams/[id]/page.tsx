"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import "@/styles/TrainingsPage.css";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type Team = {
  id: number;
  name: string;
  description: string;
  country: string;
  coachId: number;
};

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function TeamDetailPage() {
  const params = useParams<{ id: string }>();
  const teamId = params.id;
    const router = useRouter();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/teams/${teamId}`);

        if (!res.ok) {
          setError(await res.text());
          return;
        }

        const data: Team = await res.json();
        setTeam(data);
        // keď neskôr spravíš endpoint /teams/{id}/members, vieš tu dohnať aj členov
      } catch {
        setError("Server nie je dostupný");
      }
    };

    if (teamId) fetchTeam();
  }, [teamId]);

  return (
    <div className="team-layout">
      <Sidebar selected="Tím" setSelected={() => {}} />

      <main className="team-main">
        <header className="team-header-bar">
          <h1 className="team-title">Detail tímu</h1>
        </header>

        <section className="team-card">
          {error && <p className="team-error">{error}</p>}

          {team && (
            <>
              <div className="team-field-row">
        <div>
          <h2 className="team-name">{team.name}</h2>
          <p className="team-desc">{team.description}</p>
        </div>
        <button
          type="button"
          className="edit-icon-button"
          onClick={() => router.push(`/teams/${team.id}/edit`)}
        >
          ✏️
        </button>
      </div>

      <div className="team-field-row">
        <p className="team-meta">Krajina: {team.country}</p>
        <button
          type="button"
          className="edit-icon-button"
          onClick={() => router.push(`/teams/${team.id}/edit`)}
        >
          ✏️
        </button>
      </div>

      <div className="team-field-row">
        <p className="team-meta">Tréner ID: {team.coachId}</p>
        <button
          type="button"
          className="edit-icon-button"
          onClick={() => router.push(`/teams/${team.id}/edit`)}
        >
          ✏️
        </button>
      </div>            </>
          )}

          {members.length > 0 && (
            <>
              <h3 className="team-members-title">Členovia tímu</h3>
              <ul className="team-members-list">
                {members.map((m) => (
                  <li key={m.id} className="team-member-item">
                    {m.name} – {m.role} ({m.email})
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
