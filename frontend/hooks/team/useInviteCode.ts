"use client";

import { apiClient } from "@/lib/apiClient";
import { useState } from "react";

export function useInviteCode(teamId: string) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setCode("");

    try {
      const res = await apiClient(`/teams/${teamId}/invite`, {
        method: "POST",
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
