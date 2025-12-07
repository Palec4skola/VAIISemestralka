"use client";

import Sidebar from "@/components/Sidebar";
import "@/styles/TrainingsPage.css";

type TrainingDetail = {
  id: number;
  date: string;
  time: string;
  location: string;
  type: string;
  intensity: "Low" | "Medium" | "High";
  note?: string;
  durationMinutes: number;
  coachName: string;
};

const MOCK_TRAINING_DETAIL: TrainingDetail = {
  id: 1,
  date: "2024-12-10",
  time: "18:00",
  location: "Štadión Skolkari",
  type: "Technický tréning",
  intensity: "Medium",
  note: "Zameranie na prihrávky a pressing",
  durationMinutes: 90,
  coachName: "Tréner Novák",
};

export default function TrainingDetailPage() {
  const t = MOCK_TRAINING_DETAIL; // neskôr nahradíš fetchom podľa id z URL

  return (
    <div className="trainings-layout">
      <Sidebar selected="Tréningy" setSelected={() => {}} />

      <main className="trainings-main">
        <header className="trainings-header">
          <h1 className="trainings-title">Detail tréningu</h1>
        </header>

        <section className="training-detail-card">
          <div className="training-detail-header">
            <div>
              <p className="training-date">
                {t.date} · {t.time}
              </p>
              <h2 className="training-type">{t.type}</h2>
            </div>
            <span
              className={`training-intensity ${t.intensity.toLowerCase()}`}
            >
              {t.intensity}
            </span>
          </div>

          <p className="training-location">Miesto: {t.location}</p>
          <p className="training-location">
            Tréner: {t.coachName}
          </p>
          <p className="training-location">
            Trvanie: {t.durationMinutes} min
          </p>

          {t.note && (
            <p className="training-note">
              Poznámka: {t.note}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
