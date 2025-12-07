"use client";
import { useState } from "react";
import "../../styles/RegisterPage.css";
import { useRouter } from "next/navigation";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequiredName,
} from "@/lib/validation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_URL =", API_URL);

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  

  const handleRegister = async () => {
  console.log("CLICK REGISTER");

  const nameError = validateRequiredName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const confirmError = validateConfirmPassword(password, confirmPassword);

    if (nameError || emailError || passwordError || confirmError) {
      // zobrazíš prvú chybu (alebo si môžeš spraviť mapu chýb pre každý input)
      setError(nameError || emailError || passwordError || confirmError || "");
      console.log("VALIDATION FAIL:", {
        nameError,
        emailError,
        passwordError,
        confirmError,
      });
      return;
    }

  try {
    console.log("SENDING REQUEST TO:", `${API_URL}/auth/register`);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    console.log("RESPONSE STATUS:", response.status);

    if (!response.ok) {
      console.log("RESPONSE ERROR:", await response.text());
      setError("Registrácia zlyhala");
      return;
    }

    console.log("REGISTRATION OK → push /login");
    router.push("/login");
    
  } catch (err) {
    console.log("FETCH ERROR:", err);
    setError("Server nie je dostupný");
  }
};


  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrácia</h2>
        <input
          placeholder="Meno"
          type="name"
          className="register-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          type="email"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Heslo"
          type="password"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          placeholder="Potvrď heslo"
          type="password"
          className="register-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}

        <button className="register-button" onClick={handleRegister}>
          Registrovať sa
        </button>
      </div>
    </div>
  );
}
