"use client";

import Sidebar from "@/components/Sidebar";
import "@/styles/PlayersPage.css";

type Player = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const MOCK_PLAYER: Player = {
  id: 1,
  name: "Peter Novák",
  email: "peter.novak@example.com",
  role: "player",
};

export default function PlayerDetailPage() {
  return (
    <div className="team-layout">
      <Sidebar  />

      <main className="team-main">
        <header className="team-header-bar">
          <h1 className="team-title">Detail hráča</h1>
        </header>

        <section className="player-card">
          <div className="player-header">
            <div className="player-avatar">P</div>
            <div>
              <h2 className="player-name">Peter Novák</h2>
              <p className="player-email">peter.novak@example.com</p>
              <span className="player-role">Hráč</span>
            </div>
          </div>

          <div className="player-extra">
            <div className="player-row">
                <span>Výška: 180 cm</span>
                <button className="edit-icon-button" type="button">
                ✏️
                </button>
            </div>
            <div className="player-row">
                <span>Váha: 75 kg</span>
                <button className="edit-icon-button" type="button">
                ✏️
                </button>
            </div>
            <div className="player-row">
                <span>Pozícia: Stredný záložník</span>
                <button className="edit-icon-button" type="button">
                ✏️
                </button>
            </div>
            <div className="player-row">
                <span>Číslo dresu: 8</span>
                <button className="edit-icon-button" type="button">
                ✏️
                </button>
            </div>
            </div>

        </section>
      </main>
    </div>
  );
}
