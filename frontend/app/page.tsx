"use client";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import "@/styles/LandingPage.css";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="landing-container">
      <h1>Vitaj v aplikácii pre športové tímy</h1>
      <p>Sleduj tréningy, hráčov, dochádzku a spravuj svoj tím jednoducho.</p>
      <Button onClick={() => router.push("/login")} variant="primary">
        Prihlásiť sa
      </Button>
    </div>
  );
}
