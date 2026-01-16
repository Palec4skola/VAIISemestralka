import { useState } from "react";
import { login } from "@/services/AuthService";
import { useRouter, useSearchParams } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vyplň všetky polia");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);

      // vezmi cieľovú stránku z query parametra
      const next = searchParams.get("next");

      // bezpečnostná kontrola: povoliť len interné cesty (začína /)
      const safeNext = next && next.startsWith("/") ? next : "/home";

      router.replace(safeNext);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Prihlásenie zlyhalo");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    submit,
  };
}
