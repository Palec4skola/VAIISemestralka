"use client";
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import TeamInfoPanel from "../../components/TeamInfoPanel";
import "../../styles/HomePage.css";
import "../../styles/RegisterPage.css";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [selected, setSelected] = useState("Team");
  const router = useRouter();

  const handleSelect = (item: string) => {
    setSelected(item);

    if (item === "Tím") router.push("/teams");
    if (item === "Chat") router.push("/chat");
    if (item === "Kalendár") router.push("/calendar");
    if (item === "Zápasy") router.push("/matches");
    if (item === "Tréningy") router.push("/trainings");
    if (item === "Dochádzka") router.push("/attendance");
  };
  const team = {
    name: "Skolkari",
    members: 2,
    followers: 0,
    level: 0,
    ageGroup: "U12",
    gender: "Mixed",
    premium: false,
    visible: true,
  };

  //const matches = []; // neskôr načítaš z backendu
  
  const attendance = {}; // neskôr načítaš z backendu
  
  return (
  <div className="homepage-container">
    <Sidebar selected={selected} setSelected={handleSelect} />

    <div className="homepage-main">
      <div className="homepage-header">
        <h1 className="homepage-title">Tím</h1>

        <div className="homepage-actions">
          <button
            onClick={() => router.push("/teams/create")}
            className="primary-button"
          >
            + Create team
          </button>
          <button
            onClick={() => router.push("/teams/join")}
            className="secondary-button"
          >
            Join team
          </button>
        </div>
      </div>

      <TeamInfoPanel team={team} />
    </div>
  </div>
);


}
