"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Form, Button, Card, Nav,Alert } from "react-bootstrap";
import Link from "next/link";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequiredName,
} from "@/lib/validation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_URL =", API_URL);

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    console.log("CLICK REGISTER");

    const nameError = validateRequiredName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirmPassword);

    if (nameError || emailError || passwordError || confirmError) {
      // zobrazíš prvú chybu (alebo si môžeš spraviť mapu chýb pre každý input)
      setError(nameError || emailError || passwordError || confirmError || "");
      console.log("VALIDATION FAIL:", {
        nameError,
        emailError,
        passwordError,
        confirmError,
      });
      return;
    }

    try {
      console.log("SENDING REQUEST TO:", `${API_URL}/auth/register`);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("RESPONSE STATUS:", response.status);

      if (!response.ok) {
        console.log("RESPONSE ERROR:", await response.text());
        setError("Registrácia zlyhala");
        return;
      }

      console.log("REGISTRATION OK → push /login");
      router.push("/login");
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setError("Server nie je dostupný");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card className="p-4 shadow" style={{ width: 450 }}>
        <h3 className="text-center mb-3">Registrácia</h3>
                          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Meno</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Zadaj meno"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Zadaj email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Heslo</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Zadaj heslo"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Potvrď heslo</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Potvrď heslo"
              required
            />
          </Form.Group>


          <Button variant="success" type="submit" className="w-100">
            Registrovať sa
          </Button>
        </Form>

        <Nav.Link as={Link} href="/login">
          Už máš účet? Prihlás sa
        </Nav.Link>
      </Card>
    </Container>
  );
}
