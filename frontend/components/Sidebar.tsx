"use client";

import { useRouter, usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";

type SidebarProps = {
  selected?: string;
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

  return (
    <div className="d-flex flex-column bg-dark text-light vh-100 p-3">
      {/* Logo / názov */}
      <button
        className="btn btn-dark mb-4 fs-4 fw-bold text-start"
        onClick={() => router.push("/home")}
      >
        HomeBase
      </button>

      {/* Menu */}
      <Nav className="flex-column gap-2">
        {menuItems.map((item) => {
          const isActive =
            selected === item.label || pathname.startsWith(item.path);

          return (
            <Nav.Link
              key={item.path}
              onClick={() => {
                setSelected?.(item.label);
                router.push(item.path);
              }}
              className={`text-start rounded px-3 py-2 ${
                isActive ? "bg-primary text-white" : "text-light"
              }`} 
              style={{ cursor: "pointer" }}
            >
              {item.label}
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
}

