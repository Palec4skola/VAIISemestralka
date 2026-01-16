"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeLayout from "@/components/home/HomeLayout";
import HomeHeader from "@/components/home/HomeHeader";
import HomeActions from "@/components/home/HomeActions";
import TeamInfoPanel from "@/components/TeamInfoPanel";
import RequireAuth from "@/components/ReuqireAuth";

export default function HomePage() {
  const [selected, setSelected] = useState("Tím");
  const router = useRouter();

  const handleSelect = (item: string) => {
    setSelected(item);

    const routes: Record<string, string> = {
      Tím: "/teams",
      Chat: "/chat",
      Kalendár: "/calendar",
      Zápasy: "/matches",
      Tréningy: "/trainings",
      Dochádzka: "/attendance",
    };

    if (routes[item]) router.push(routes[item]);
  };

  const team = {
    teamId: 1,
    name: "MFK Ružomberok",
    description: "Profesionálny futbalový klub z Ružomberka.",
    country: "Slovensko",
  };

  return (
    <RequireAuth>
          <div>
    <HomeLayout selected={selected} onSelect={handleSelect}>
      <HomeHeader title="Tím" actions={<HomeActions />} />
      <TeamInfoPanel team={team} />
    </HomeLayout>
    </div>
    </RequireAuth>
  );
}
