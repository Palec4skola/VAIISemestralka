"use client";
import { useState } from "react";
import { Container, Form, Button, Card, Nav } from "react-bootstrap";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_URL =", API_URL);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Nesprávny email alebo heslo");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      window.location.href = "/home";
    } catch {
      setError("Server nie je dostupný");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card className="p-4 shadow" style={{ width: 400 }}>
        <h3 className="text-center mb-3">Prihlásenie</h3>
              {error && <p className="login-error">{error}</p>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Zadaj email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Heslo</Form.Label>
            <Form.Control
              type="password"
              placeholder="Zadaj heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Prihlásiť sa
          </Button>
        </Form>

        <Nav className="justify-content-center mt-3">
          <Nav.Link as={Link} href="/register">
            Nemáš účet? Registruj sa
          </Nav.Link>{" "}
        </Nav>
      </Card>
    </Container>
  );
}
