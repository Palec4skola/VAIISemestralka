import { Button, Alert } from "react-bootstrap";
import AuthInput from "./AuthInput";
import { useRegister } from "@/hooks/auth/useRegister";

export default function RegisterForm() {
  const {
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
  } = useRegister();
//:TODO validation
  return (
    <form onSubmit={submit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <AuthInput label="Meno" value={name} onChange={setName} />
      <AuthInput label="Email" value={email} onChange={setEmail} />
      <AuthInput
        label="Heslo"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <AuthInput
        label="Potvrdenie hesla"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      <Button type="submit" className="w-100" disabled={loading}>
        Zaregistrujte sa
      </Button>
    </form>
  );
}
