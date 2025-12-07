"use client";
import "@/styles/LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Vitaj v aplikácii pre športové tímy</h1>

      <p className="landing-subtitle">
        Sleduj tréningy, hráčov, dochádzku a spravuj svoj tím jednoducho.
      </p>

      <button 
        className="landing-button"
        onClick={() => (window.location.href = "/login")}
      >
        Prihlásiť sa
      </button>
    </div>
  );
}
