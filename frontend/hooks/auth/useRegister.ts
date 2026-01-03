import { useState } from "react";
import { register } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequiredName,
} from "@/lib/validation";

export function useRegister() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateRequiredName(name);
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(password, confirmPassword);
    if (!email || !password || !confirmPassword) {
      setError("Vyplň všetky polia");
      return;
    }

    if (password !== confirmPassword) {
      setError("Heslá sa nezhodujú");
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      router.push("/home");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registrácia zlyhala");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    email,
    password,
    confirmPassword,
    error,
    loading,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    submit,
  };
}
