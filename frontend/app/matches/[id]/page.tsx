"use client";

import Sidebar from "@/components/Sidebar";
import "@/styles/MatchesPage.css";

type MatchDetail = {
  id: number;
  date: string;
  time: string;
  opponent: string;
  location: string;
  home: boolean;
  result?: string;
  competition: string;
  goalsFor: number;
  goalsAgainst: number;
  note?: string;
};

const MOCK_MATCH_DETAIL: MatchDetail = {
  id: 1,
  date: "2024-12-20",
  time: "18:30",
  opponent: "FK Mesto",
  location: "Domáci štadión",
  home: true,
  result: "2 : 1",
  competition: "Liga - kolo 12",
  goalsFor: 2,
  goalsAgainst: 1,
  note: "Dobrý výkon v druhom polčase, gól z penalty.",
};

export default function MatchDetailPage() {
  const m = MOCK_MATCH_DETAIL; // neskôr fetch podľa id

  return (
    <div className="matches-layout">
      <Sidebar  />

      <main className="matches-main">
        <header className="matches-header">
          <h1 className="matches-title">Detail zápasu</h1>
        </header>

        <section className="match-detail-card">
          <div className="match-detail-header">
            <div>
              <p className="match-date">
                {m.date} · {m.time}
              </p>
              <h2 className="match-opponent">
                {m.home ? "Domáci" : "Hostia"} vs {m.opponent}
              </h2>
              <p className="match-competition">{m.competition}</p>
            </div>

            <span className="match-result played">
              {m.result ?? "Nadchádzajúci"}
            </span>
          </div>

          <p className="match-location">Miesto: {m.location}</p>
          <p className="match-location">
            Skóre: {m.goalsFor} : {m.goalsAgainst}
          </p>

          {m.note && <p className="match-note">Poznámka: {m.note}</p>}
        </section>
      </main>
    </div>
  );
}
