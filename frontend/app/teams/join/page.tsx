"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import "@/styles/TeamsJoinPage.css";

export default function JoinTeamPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(`(Mock) Pokus o pripojenie s kódom: ${code}`);
  };

  return (
    <div className="teams-join-layout">
      <Sidebar selected="Tím" setSelected={() => {}} />

      <main className="teams-join-main">
        <section className="teams-join-card">
          <h1 className="teams-join-title">Pripojiť sa k tímu</h1>
          <p className="teams-join-subtitle">
            Zadaj 4-miestny kód, ktorý si dostal od trénera.
          </p>

          <form onSubmit={handleSubmit} className="teams-join-form">
            <label htmlFor="join-code" className="teams-join-label">
              Kód tímu
            </label>
            <input
              id="join-code"
              type="text"
              maxLength={4}
              className="teams-join-input"
              placeholder="AB12"
              value={code}
              onChange={(e) => {
                // veľké písmená, bez medzier
                setCode(e.target.value.toUpperCase().trim());
              }}
            />

            <button
              type="submit"
              className="primary-button teams-join-button"
              disabled={code.length < 4}
            >
              Join team
            </button>
          </form>

          {message && <p className="teams-join-message">{message}</p>}
        </section>
      </main>
    </div>
  );
}
