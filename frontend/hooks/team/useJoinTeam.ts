"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";

export function useJoinTeam() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateCode = (value: string) => {
    // uppercase + trim + max 4 znaky
    setCode(value.toUpperCase().trim().slice(0, 4));
  };

  const submit = async () => {
    if (code.trim().length < 4) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Pozn.: Ty posielaš JSON string (nie objekt). Nechávam to rovnako.
      const res = await apiClient("/teams/join", {
        method: "POST",
        body: JSON.stringify(code.trim()),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setError(text || "Nepodarilo sa pripojiť k tímu.");
        return;
      }

      setSuccess("Úspešne si sa pripojil k tímu! 🎉");
      router.push("/home");
    } catch {
      setError("Server nie je dostupný");
    } finally {
      setLoading(false);
    }
  };

  return { code, updateCode, loading, error, success, submit };
}
