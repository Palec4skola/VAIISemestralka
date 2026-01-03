import { Button, Alert } from "react-bootstrap";
import AuthInput from "./AuthInput";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginForm() {
  const { email, password, error, loading, setEmail, setPassword, submit } =
    useLogin();

  return (
    <form onSubmit={submit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <AuthInput label="Email" value={email} onChange={setEmail} />
      <AuthInput label="Heslo" type="password" value={password} onChange={setPassword} />

      <Button type="submit" className="w-100" disabled={loading}>
        Prihlásiť sa
      </Button>
    </form>
  );
}
