"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function useInviteCode(teamId: string) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setCode("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Nie si prihlásený.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/teams/${teamId}/invite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      const data = await res.json();
      const invite = data.code ?? data.inviteCode;
      console.log("Received invite code:", invite);
      if (!invite) {
        setError("Backend nevrátil invite kód.");
        return;
      }

      setCode(invite);
    } catch {
      setError("Server nie je dostupný");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCode("");
    setError("");
    setLoading(false);
  };

  return { code, loading, error, generate, reset };
}
