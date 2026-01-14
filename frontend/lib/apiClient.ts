"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type ApiOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiClient(
  path: string,
  options: ApiOptions = {}
) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (!options.skipAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
}
