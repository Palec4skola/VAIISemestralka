"use client";

import "../styles/HomePage.css";
import { useRouter, usePathname } from "next/navigation";

type SidebarProps = {
  selected?: string; // môžeš nechať voliteľné alebo vyhodiť
  setSelected?: (value: string) => void;
};

export default function Sidebar({ selected, setSelected }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: "Tím", path: "/teams" },
    { label: "Chat", path: "/chat" },
    { label: "Kalendár", path: "/calendar" },
    { label: "Zápasy", path: "/matches" },
    { label: "Tréningy", path: "/trainings" },
    { label: "Dochádzka", path: "/attendance" },
  ];

  const handleClick = (itemLabel: string, path: string) => {
    setSelected?.(itemLabel);      // ak rodič chce vedieť selected
    router.push(path);             // reálna navigácia
  };

  return (
    <div className="sidebar">
      <button
        className="logo-button"
        type="button"
        onClick={() => router.push("/home")}   // HomeBase → domovská stránka
      >
        HomeBase
      </button>

      <ul className="menu">
        {menuItems.map((item) => {
          const isActive =
            selected === item.label || pathname.startsWith(item.path);

          return (
            <li
              key={item.path}
              className={isActive ? "active" : ""}
              onClick={() => handleClick(item.label, item.path)}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
