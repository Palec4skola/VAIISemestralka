"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import "@/styles/TeamPage.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type Team = {
  id: number;
  name: string;
  description: string;
  country: string;
  coachId: number;
};

export default function EditTeamPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const teamId = params.id;

  const [form, setForm] = useState<Team | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/teams/${teamId}`);
        if (!res.ok) {
          setError(await res.text());
          return;
        }
        const data: Team = await res.json();
        setForm(data);
      } catch {
        setError("Server nie je dostupný");
      }
    };

    if (teamId) fetchTeam();
  }, [teamId]);

  const handleChange =
    (field: keyof Team) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!form) return;
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          country: form.country,
          coachId: form.coachId,
        }),
      });

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setSuccess("Tím bol upravený.");
      // napr. späť na detail
      router.push(`/teams/${teamId}`);
    } catch {
      setError("Server nie je dostupný");
    }
  };

  return (
    <div className="team-layout">
      <Sidebar selected="Tím" setSelected={() => {}} />

      <main className="team-main">
        <header className="team-header-bar">
          <h1 className="team-title">Upraviť tím</h1>
        </header>

        <section className="team-card">
          {error && <p className="team-error">{error}</p>}
          {success && <p className="team-success">{success}</p>}

          {form && (
            <form onSubmit={handleSubmit} className="team-form">
              <div className="form-row">
                <label htmlFor="name">Názov tímu</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                />
              </div>

              <div className="form-row">
                <label htmlFor="description">Popis</label>
                <textarea
                  id="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange("description")}
                />
              </div>

              <div className="form-row">
                <label htmlFor="country">Krajina</label>
                <input
                  id="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange("country")}
                />
              </div>

              <button type="submit" className="primary-button">
                Uložiť zmeny
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
