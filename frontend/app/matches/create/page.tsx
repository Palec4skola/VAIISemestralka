"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import "@/styles/MatchesPage.css";

type MatchForm = {
  date: string;      // "2024-12-20"
  time: string;      // "18:30"
  location: string;
  opponent: string;
  result: string;    // napr. "2 : 1" alebo prázdne pre budúci zápas
};

export default function CreateMatchPage() {
  const [form, setForm] = useState<MatchForm>({
    date: "",
    time: "",
    location: "",
    opponent: "",
    result: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange =
    (field: keyof MatchForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.date || !form.time || !form.location || !form.opponent) {
      setError("Vyplň dátum, čas, miesto a súpera");
      return;
    }

    // zatiaľ len mock – neskôr tu bude fetch na API
    console.log("CREATE MATCH MOCK:", form);
    setSuccess("Zápas bol (mock) vytvorený.");
  };

  return (
    <div className="matches-layout">
      <Sidebar  />

      <main className="matches-main">
        <header className="matches-header">
          <h1 className="matches-title">Vytvoriť zápas</h1>
        </header>

        <section className="match-detail-card">
          <form onSubmit={handleSubmit} className="match-form">
            {error && <p className="team-error">{error}</p>}
            {success && <p className="team-success">{success}</p>}

            <div className="form-row">
              <label htmlFor="date">Dátum</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={handleChange("date")}
              />
            </div>

            <div className="form-row">
              <label htmlFor="time">Čas</label>
              <input
                id="time"
                type="time"
                value={form.time}
                onChange={handleChange("time")}
              />
            </div>

            <div className="form-row">
              <label htmlFor="location">Miesto</label>
              <input
                id="location"
                type="text"
                placeholder="Domáci štadión / ihrisko súpera..."
                value={form.location}
                onChange={handleChange("location")}
              />
            </div>

            <div className="form-row">
              <label htmlFor="opponent">Súper</label>
              <input
                id="opponent"
                type="text"
                placeholder="Názov súpera"
                value={form.opponent}
                onChange={handleChange("opponent")}
              />
            </div>

            <div className="form-row">
              <label htmlFor="result">
                Výsledok (voliteľné, napr. 2 : 1)
              </label>
              <input
                id="result"
                type="text"
                placeholder="2 : 1"
                value={form.result}
                onChange={handleChange("result")}
              />
            </div>

            <button type="submit" className="primary-button">
              Uložiť zápas
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
