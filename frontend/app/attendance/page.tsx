"use client";

import Sidebar from "@/components/Sidebar";
import "@/styles/AttendancePage.css";

type PlayerAttendance = {
  id: number;
  name: string;
  position: string;
  status: "pride" | "nepride" | "zvazujem";
};

const MOCK_PLAYERS: PlayerAttendance[] = [
  { id: 1, name: "Peter Novák", position: "Stredný záložník", status: "pride" },
  { id: 2, name: "Ján Kováč", position: "Útočník", status: "zvazujem" },
  { id: 3, name: "Martin Horváth", position: "Obranca", status: "nepride" },
  { id: 4, name: "Lukáš Hudák", position: "Brankár", status: "pride" },
];

const MOCK_SESSIONS = [
  { id: 1, date: "2024-12-10", time: "18:00", present: 12, total: 15 },
  { id: 2, date: "2024-12-12", time: "19:00", present: 10, total: 15 },
  { id: 3, date: "2024-12-15", time: "17:30", present: 14, total: 15 },
];

export default function AttendancePage() {
  return (
    <div className="attendance-layout">
      <Sidebar selected="Dochádzka" setSelected={() => {}} />

      <main className="attendance-main">
        <header className="attendance-header">
          <h1 className="attendance-title">Dochádzka</h1>
        </header>

        <section className="attendance-grid">
          <div className="attendance-card">
            <h2 className="attendance-subtitle">Najbližší tréning</h2>
            <p className="attendance-text">Dátum: 10. 12. 2024 · 18:00</p>
            <p className="attendance-text">Miesto: Umelá tráva</p>
            <p className="attendance-text">Potvrdených hráčov: 2 / 4 (mock)</p>

            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Hráč</th>
                  <th>Pozícia</th>
                  <th>Stav</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PLAYERS.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.position}</td>
                    <td>
                      <span
                        className={`attendance-badge attendance-${p.status}`}
                      >
                        {p.status === "pride"
                          ? "Príde"
                          : p.status === "nepride"
                          ? "Nepríde"
                          : "Zvažujem"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="attendance-card">
            <h2 className="attendance-subtitle">Posledné tréningy</h2>
            <ul className="attendance-sessions">
              {MOCK_SESSIONS.map((s) => (
                <li key={s.id} className="attendance-session-item">
                  <div>
                    <div className="attendance-session-date">
                      {s.date} · {s.time}
                    </div>
                    <div className="attendance-session-bar">
                      <div
                        className="attendance-session-bar-fill"
                        style={{
                          width: `${(s.present / s.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="attendance-session-count">
                    {s.present} / {s.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
