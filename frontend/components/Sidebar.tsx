"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Nav, Button, Offcanvas } from "react-bootstrap";

type MenuItem = { label: string; path: string };

const menuItems: MenuItem[] = [
  { label: "Tímy", path: "/teams" },
  { label: "Chat", path: "/chat" },
  { label: "Kalendár", path: "/calendar" },
  { label: "Zápasy", path: "/matches" },
  { label: "Tréningy", path: "/trainings" },
  { label: "Dochádzka", path: "/attendance" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  const go = (path: string) => {
    router.push(path);
    setShow(false); // na mobile zavrie menu po kliknutí
  };

  // Active len keď si na route alebo v jej podstránke
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const NavContent = (
    <Nav className="flex-column gap-2">
      {menuItems.map((item) => (
        <Nav.Link
          key={item.path}
          onClick={() => go(item.path)}
          className={`text-start rounded px-3 py-2 ${
            isActive(item.path) ? "bg-primary text-white" : "text-light"
          }`}
          style={{ cursor: "pointer" }}
        >
          {item.label}
        </Nav.Link>
      ))}
    </Nav>
  );

  return (
    <>
      {/* MOBILE: iba hamburger tlačidlo (fixne vľavo hore) */}
      <div
        className="d-md-none position-fixed top-0 start-0 p-2"
        style={{ zIndex: 1030 }}
      >
        <Button variant="dark" onClick={() => setShow(true)}>
          ☰
        </Button>
      </div>

      {/* DESKTOP: pevný sidebar */}
      <div
        className="d-none d-md-flex flex-column bg-dark text-light p-3"
        style={{
          width: 240,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Button
          variant="dark"
          className="mb-4 fs-4 fw-bold text-start p-0"
          onClick={() => router.push("/home")}
        >
          HomeBase
        </Button>
        {NavContent}
      </div>

      {/* MOBILE: offcanvas sidebar zľava */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="start"
        className="bg-dark text-light"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>HomeBase</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{NavContent}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
