"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import "@/styles/TrainingsPage.css";
import { useRouter } from "next/navigation";

type Training = {
  id: number;
  date: string;
  time: string;
  location: string;
  type: string;
  intensity: "Low" | "Medium" | "High";
  note?: string;
};

const MOCK_TRAININGS: Training[] = [
  {
    id: 1,
    date: "2024-12-10",
    time: "18:00",
    location: "Štadión Skolkari",
    type: "Technický tréning",
    intensity: "Medium",
    note: "Zobrať tréningové lopty",
  },
  {
    id: 2,
    date: "2024-12-12",
    time: "19:00",
    location: "Umelá tráva",
    type: "Kondičný tréning",
    intensity: "High",
    note: "Behy + intervaly",
  },
  {
    id: 3,
    date: "2024-12-15",
    time: "17:30",
    location: "Telocvičňa",
    type: "Regeneračný tréning",
    intensity: "Low",
    note: "Strečing, core",
  },
];

export default function TrainingsPage() {
  const router = useRouter();
  return (
    <div className="trainings-layout">
      <Sidebar selected="Tréningy" setSelected={() => {}} />

      <main className="trainings-main">
        <header className="trainings-header">
          <h1 className="trainings-title">Tréningy</h1>
          <button className="primary-button" onClick={() => router.push("/trainings/create")}>+ Pridať tréning</button>
        </header>

        <section className="trainings-list">
          {MOCK_TRAININGS.map((t) => (
            <Link
              key={t.id}
              href={`/trainings/${t.id}`}
              className="training-card-link"
            >
              <article className="training-card">
                <div className="training-row">
                  <div>
                    <p className="training-date">
                      {t.date} · {t.time}
                    </p>
                    <p className="training-type">{t.type}</p>
                  </div>
                  <span
                    className={`training-intensity ${t.intensity.toLowerCase()}`}
                  >
                    {t.intensity}
                  </span>
                </div>

                <p className="training-location">{t.location}</p>

                {t.note && (
                  <p className="training-note">Poznámka: {t.note}</p>
                )}
              </article>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
