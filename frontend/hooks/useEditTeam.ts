"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Team } from "@/types/team";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function useEditTeam(teamId: string) {
  const router = useRouter();

  const [form, setForm] = useState<Team | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/teams/${teamId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setError(await res.text());
          return;
        }

        const data: Team = await res.json();
        setForm(data);
      } catch {
        setError("Server nie je dostupný");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  const updateField = (field: keyof Team, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  const submit = async () => {
    if (!form) return;

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.teamName,
          description: form.description,
          country: form.country,
        }),
      });

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setSuccess("Tím bol upravený");
      router.push(`/teams/${teamId}`);
    } catch {
      setError("Server nie je dostupný");
    }
  };

  return {
    form,
    loading,
    error,
    success,
    updateField,
    submit,
  };
}
