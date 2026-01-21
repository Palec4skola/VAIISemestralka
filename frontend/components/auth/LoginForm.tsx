import { Button, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import AuthInput from "./AuthInput";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginForm() {
  const { email, password, error, loading, setEmail, setPassword, submit } = useLogin();
  const router = useRouter();

  return (
    <>
      <form onSubmit={submit}>
        {error && <Alert variant="danger">{error}</Alert>}

        <AuthInput label="Email" value={email} onChange={setEmail} />
        <AuthInput label="Heslo" type="password" value={password} onChange={setPassword} />

        <Button type="submit" className="w-100" disabled={loading}>
          Prihlásiť sa
        </Button>
      </form>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}
          onClick={() => router.push('/register')}
        >
          Ešte nemáte účet? Zaregistrujte sa
        </button>
      </div>
    </>
  );
}
