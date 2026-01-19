"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type { UserProfile } from "@/types/user";

export function useMyProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiClient("/users/me");
      console.log(res);
      if (!res.ok) {
        setError(await res.text());
        setProfile(null);
        return;
      }

      setProfile(await res.json());
    } catch {
      setError("Server nie je dostupný");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return { profile, setProfile, loading, error, reload };
}
