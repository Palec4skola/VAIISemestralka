import { useState } from "react";
import { login } from "@/services/AuthService";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();
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
      router.push("/home");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Prihlásenie zlyhalo");
      }
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
