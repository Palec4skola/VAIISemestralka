"use client";
import "../../styles/LoginPage.css";
import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_URL =", API_URL);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setError("Nesprávny email alebo heslo");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      window.location.href = "/home";
    } catch {
      setError("Server nie je dostupný");
    }
  };

  return (
    <div className="login-container">
      <h2>Prihlásenie</h2>

      <input 
        placeholder="Email"
        className="login-input"
        onChange={e => setEmail(e.target.value)}
      />

      <input 
        placeholder="Heslo"
        type="password"
        className="login-input"
        onChange={e => setPassword(e.target.value)}
      />

      {error && <p className="login-error">{error}</p>}

      <button className="login-button" onClick={handleLogin}>
        Prihlásiť sa
      </button>
      <p className="login-register-text">
        Ešte nemáte účet?{" "}
        <Link href="/register" className="login-register-link">
          Zaregistrujte sa
        </Link>
      </p>
    </div>
  );
}
