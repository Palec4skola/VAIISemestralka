"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateRequiredTeamName, validateRequiredCountry, validateRequiredDescription } from "@/lib/validation";
export default function CreatePage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [coachId, setCoachId] = useState("");
    const [country, setCountry] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleCreate = async () => {
        const nameError = validateRequiredTeamName(name);
        const descriptionError = validateRequiredDescription(description);
        const countryError = validateRequiredCountry(country);
        if (nameError || descriptionError || countryError) {
            setError(nameError || descriptionError || countryError || "");
            console.log("VALIDATION FAIL:", {
                nameError,
                descriptionError,
                countryError,
            });
            return;
        }
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`${API_URL}/teams/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ name, description, country }),
        });

    if (response.ok) {
      router.push("/home");
    } else {
      console.log("CREATE TEAM ERROR:", await response.text());
      setError("Chyba pri vytváraní tímu");
    }
}
return (
    <div className="register-container">
      <div className="register-card">
        <h2>Vytvorenie tímu</h2>
        <input
          placeholder="Názov tímu"
          type="name"
          className="register-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Popis tímu"
          type="description"
          className="register-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Krajina"
          type="country"
          className="register-input"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        {error && <p className="register-error">{error}</p>}

        <button className="register-button" onClick={handleCreate}>
          Vytvoriť tím
        </button>
      </div>
    </div>
  );
}