"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import "@/styles/TrainingsPage.css";


type TrainingForm = {
  date: string;      // napr. "2024-12-10"
  time: string;      // "18:00"
  location: string;
  description: string;
};

export default function CreateTrainingPage() {
  const [form, setForm] = useState<TrainingForm>({
    date: "",
    time: "",
    location: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange =
    (field: keyof TrainingForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.date || !form.time || !form.location) {
      setError("Vyplň dátum, čas a miesto tréningu");
      return;
    }

    // zatiaľ len konzola – neskôr sem pôjde fetch na API
    console.log("CREATE TRAINING MOCK:", form);
    setSuccess("Tréning bol (mock) vytvorený.");
  };

  return (
    <div className="trainings-layout">
      <Sidebar selected="Tréningy" setSelected={() => {}} />

      <main className="trainings-main">
        <header className="trainings-header">
          <h1 className="trainings-title">Vytvoriť tréning</h1>
        </header>

        <section className="training-detail-card">
          <form onSubmit={handleSubmit} className="training-form">
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
                placeholder="Ihrisko, štadión..."
                value={form.location}
                onChange={handleChange("location")}
              />
            </div>

            <div className="form-row">
              <label htmlFor="description">Popis</label>
              <textarea
                id="description"
                rows={3}
                placeholder="Krátky popis tréningu..."
                value={form.description}
                onChange={handleChange("description")}
              />
            </div>

            <button type="submit" className="primary-button">
              Uložiť tréning
            </button>
          </form>
        </section>
      </main>
    </div>);
}