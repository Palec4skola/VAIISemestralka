"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  validateRequiredTeamName,
  validateRequiredCountry,
  validateRequiredDescription,
} from "@/lib/validation";
import { Container, Card, Form, Button } from "react-bootstrap";
const COUNTRIES = [
  "Slovensko",
  "Česko",
  "Poľsko",
  "Maďarsko",
  "Rakúsko",
  "Nemecko",
  "Taliansko",
  "Francúzsko",
  "Španielsko",
  "Anglicko",
];

export default function CreatePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coachId, setCoachId] = useState("");
  const [country, setCountry] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleCreate = async () => {
    const nameError = validateRequiredTeamName(name);
    const descriptionError = validateRequiredDescription(description);
    const countryError = validateRequiredCountry(country);
    if (nameError || descriptionError || countryError) {
      setError(nameError || descriptionError || countryError || "");
      console.log("VALIDATION FAIL:", {
        nameError,
        descriptionError,
        countryError,
      });
      return;
    }
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const response = await fetch(`${API_URL}/teams/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ name, description, country }),
    });

    if (response.ok) {
      router.push("/home");
    } else {
      console.log("CREATE TEAM ERROR:", await response.text());
      setError("Chyba pri vytváraní tímu");
    }
  };
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ maxWidth: 400, width: "100%" }}>
        <Card.Body>
          <Card.Title className="mb-3">Vytvorenie tímu</Card.Title>

          <Form>
            <Form.Group className="mb-3" controlId="teamName">
              <Form.Label>Názov tímu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Názov tímu"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="teamDescription">
              <Form.Label>Popis tímu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Popis tímu"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="teamCountry">
              <Form.Label>Krajina</Form.Label>
              <Form.Select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">-- Vyber krajinu --</option>

                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {error && <div className="text-danger mb-3">{error}</div>}

            <Button variant="primary" onClick={handleCreate} className="w-100">
              Vytvoriť tím
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
