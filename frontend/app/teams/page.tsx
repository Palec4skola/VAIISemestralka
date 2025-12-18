"use client";
import '@/styles/HomePage.css';
import '@/styles/TeamPage.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();


  useEffect(() => {
  const fetchTeam = async () => {
    try {
       const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`${API_URL}/teams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
        });

      if (!response.ok) {
        setError(await response .text());
        return;
      }

      const data: Team[] = await response .json(); // priamo pole
      setTeams(data);
      // setMembers nepotrebuješ, endpoint žiadnych členov neposiela
    } catch (e) {
      setError("Server nie je dostupný");
    }
  };

    fetchTeam();
  }, []);
const handleDelete = async (id: number) => {
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

    setTeams((prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
  } catch {
    setError("Server nie je dostupný");
  }
};
  return (
  <div className="team-layout">
    <Sidebar selected="Tím" setSelected={() => {}} />

    <main className="team-main">
      <header className="team-header-bar">
        <h1 className="team-title">Tímy</h1>
      </header>

      <section className="team-card">
        {error && <p className="team-error">{error}</p>}

        {teams && teams.length > 0 ? (
          <ul className="team-list">
            {teams.map((team) => (
              <li key={team.id} className="team-list-item">
                <button
                  className="team-card-button"
                  onClick={() => router.push(`/teams/${team.id}`)}
                  type="button"
                >
                  <h2 className="team-name">{team.name}</h2>
                  <p className="team-desc">{team.description}</p>
                  <p className="team-meta">Krajina: {team.country}</p>
                  <p className="team-meta">Tréner ID: {team.coachId}</p>
                </button>
                <button
                  type="button"
                  className="delete-icon-button"
                  onClick={() => handleDelete(team.id)}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Žiadne tímy neboli nájdené.</p>
        )}
      </section>
    </main>
  </div>

);
}