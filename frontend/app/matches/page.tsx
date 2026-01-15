"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import "@/styles/MatchesPage.css";
import { useRouter } from "next/navigation";

type Match = {
  id: number;
  date: string;
  time: string;
  opponent: string;
  location: string;
  home: boolean;
  result?: string; // napr. "2:1"
  competition: string;
};

const MOCK_MATCHES: Match[] = [
  {
    id: 1,
    date: "2024-12-20",
    time: "18:30",
    opponent: "FK Mesto",
    location: "Domáci štadión",
    home: true,
    result: "2 : 1",
    competition: "Liga - kolo 12",
  },
  {
    id: 2,
    date: "2024-12-27",
    time: "17:00",
    opponent: "TJ Družstevník",
    location: "Ihrisko súpera",
    home: false,
    result: undefined,
    competition: "Prípravný zápas",
  },
  {
    id: 3,
    date: "2025-01-05",
    time: "19:00",
    opponent: "FC Junior",
    location: "Umelá tráva",
    home: true,
    result: "0 : 0",
    competition: "Pohár",
  },
];

export default function MatchesPage() {
    const router = useRouter();
  return (
    <div className="matches-layout">
      <Sidebar  />

      <main className="matches-main">
        <header className="matches-header">
          <h1 className="matches-title">Zápasy</h1>
          <button className="primary-button" onClick={() => router.push("/matches/create")}>+ Pridať zápas</button>
        </header>

        <section className="matches-list">
          {MOCK_MATCHES.map((m) => (
            <Link
              key={m.id}
              href={`/matches/${m.id}`}
              className="match-card-link"
            >
              <article className="match-card">
                <div className="match-row">
                  <div>
                    <p className="match-date">
                      {m.date} · {m.time}
                    </p>
                    <p className="match-opponent">
                      {m.home ? "Domáci" : "Hostia"} vs {m.opponent}
                    </p>
                    <p className="match-competition">{m.competition}</p>
                  </div>

                  {m.result ? (
                    <span className="match-result played">{m.result}</span>
                  ) : (
                    <span className="match-result upcoming">Nadchádzajúci</span>
                  )}
                </div>

                <p className="match-location">{m.location}</p>
              </article>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
