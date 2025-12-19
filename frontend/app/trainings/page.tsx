"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import "@/styles/TrainingsPage.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Training = {
  id: number;
  date: string;
  time: string;
  location: string;
  type: string;
  intensity: "Low" | "Medium" | "High";
  description?: string;
};

// const MOCK_TRAININGS: Training[] = [
//   {
//     id: 1,
//     date: "2024-12-10",
//     time: "18:00",
//     location: "Štadión Skolkari",
//     type: "Technický tréning",
//     intensity: "Medium",
//     note: "Zobrať tréningové lopty",
//   },
//   {
//     id: 2,
//     date: "2024-12-12",
//     time: "19:00",
//     location: "Umelá tráva",
//     type: "Kondičný tréning",
//     intensity: "High",
//     note: "Behy + intervaly",
//   },
//   {
//     id: 3,
//     date: "2024-12-15",
//     time: "17:30",
//     location: "Telocvičňa",
//     type: "Regeneračný tréning",
//     intensity: "Low",
//     note: "Strečing, core",
//   },
// ];
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function TrainingsPage() {
    const router = useRouter();
     const [trainings, setTrainings] = useState<Training[] | null>(null);
    const [error, setError] = useState("");
   

    useEffect(() => {
      const fetchTrainings = async () => {
        try {
           const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const response = await fetch(`${API_URL}/trainings`, {
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
    
          const data: Training[] = await response .json(); // priamo pole
          setTrainings(data);
          // setMembers nepotrebuješ, endpoint žiadnych členov neposiela
        } catch (e) {
          setError("Server nie je dostupný");
        }
      };fetchTrainings();
  }, []);

  return (
    <div className="trainings-layout">
      <Sidebar selected="Tréningy" setSelected={() => {}} />

      <main className="trainings-main">
        <header className="trainings-header">
          <h1 className="trainings-title">Tréningy</h1>
          <button className="primary-button" onClick={() => router.push("/trainings/create")}>+ Pridať tréning</button>
        </header>

        <section className="trainings-list">
          {trainings?.map((t) => (
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
                  {/* <span
                    className={`training-intensity ${t.intensity.toLowerCase()}`}
                  >
                    {t.intensity}
                  </span> */}
                </div>

                <p className="training-location">{t.location}</p>

                {t.description && (
                  <p className="training-note">Poznámka: {t.description}</p>
                )}
              </article>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
