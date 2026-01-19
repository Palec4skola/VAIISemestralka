"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type { UpdateUserProfileDto } from "@/types/user";

export function useUpdateMyProfile(options?: {
  onUpdated?: (patch: UpdateUserProfileDto) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = async (dto: UpdateUserProfileDto) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiClient("/users/me", {
        method: "PUT",
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        setError(await res.text());
        return false;
      }

      setSuccess("Uložené ✅");
      options?.onUpdated?.(dto);
      return true;
    } catch {
      setError("Server nie je dostupný");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return { update, saving, error, success, clearMessages };
}
