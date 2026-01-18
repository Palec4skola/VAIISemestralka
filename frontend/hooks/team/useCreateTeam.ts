"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import {
  validateRequiredTeamName,
  validateRequiredCountry,
  validateRequiredDescription,
} from "@/lib/validation";

export type CreateTeamFormState = {
  name: string;
  description: string;
  country: string;
};

export function useCreateTeam() {
  const router = useRouter();

  const [form, setForm] = useState<CreateTeamFormState>({
    name: "",
    description: "",
    country: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof CreateTeamFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    const nameError = validateRequiredTeamName(form.name);
    const descriptionError = validateRequiredDescription(form.description);
    const countryError = validateRequiredCountry(form.country);

    if (nameError || descriptionError || countryError) {
      setError(nameError || descriptionError || countryError || "");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiClient("/teams/create", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          country: form.country,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setError(text || "Chyba pri vytváraní tímu");
        return;
      }

      router.push("/home");
    } catch {
      setError("Server nie je dostupný");
    } finally {
      setLoading(false);
    }
  };

  return { form, updateField, submit, error, loading };
}
