"use client";
import '@/styles/HomePage.css';
import '@/styles/RegisterPage.css';
import '@/styles/TeamPage.css';
import { useState } from 'react';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
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
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null);
  //const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");
  const members = [
  { id: 1, name: "Peter Novák", email: "peter@example.com", role: "coach" },
  { id: 2, name: "Ján Kováč", email: "jan@example.com", role: "player" },
  { id: 3, name: "Martin Horváth", email: "martin@example.com", role: "player" },
];


  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/api/teams/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          setError(await res.text());
          return;
        }

        const data = await res.json();
        setTeam(data.team);
        //setMembers(data.members);
      } catch (e) {
        setError("Server nie je dostupný");
      }
    };

    fetchTeam();
  }, []);

  return (
  <div className="team-layout">
    <Sidebar selected="Tím" setSelected={() => {}} />

    <main className="team-main">
      <header className="team-header-bar">
        <h1 className="team-title">Tím</h1>
      </header>

      <section className="team-card">
        {error && <p className="team-error">{error}</p>}

        {team && (
          <>
            <h2 className="team-name">{team.name}</h2>
            <p className="team-desc">{team.description}</p>
            <p className="team-meta">Krajina: {team.country}</p>
          </>
        )}

        <h3 className="team-members-title">Členovia tímu</h3>
        <ul className="team-members-list">
        {members.map((m) => (
            <li key={m.id} className="team-member-item">
            <Link href={`/players/${m.id}`} className="team-member-link">
                <div className="team-member-avatar">
                {m.name.charAt(0).toUpperCase()}
                </div>
                <div className="team-member-info">
                <div className="team-member-name-row">
                    <span className="team-member-name">{m.name}</span>
                    <span className="team-member-role">
                    {m.role === "coach" ? "Tréner" : "Hráč"}
                    </span>
                </div>
                <span className="team-member-email">{m.email}</span>
                </div>
            </Link>
            </li>
        ))}
        </ul>
      </section>
    </main>
  </div>
);

}