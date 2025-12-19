"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

export default function CreateTrainingPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!date || !location) {
      setError("Vyplň dátum, čas a miesto tréningu");
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const response = await fetch(`${API_URL}/trainings/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ date, location, description }),
    });
    if (!response.ok) {
        setError(await response.text());
        return;
      }
      router.push("/trainings");
  };

  return (
    <div className="d-flex">
      <Sidebar selected="Tréningy" setSelected={() => {}} />

      <main className="flex-grow-1 p-3">
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <h1 className="h3">Vytvoriť tréning</h1>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card>
                <Card.Body>
                  <Form>
                    {error && (
                      <Alert variant="danger" className="mb-3">
                        {error}
                      </Alert>
                    )}
                    {success && (
                      <Alert variant="success" className="mb-3">
                        {success}
                      </Alert>
                    )}

                    <Form.Group className="mb-3" controlId="date" onSubmit={handleCreate}>
                      <Form.Label>Dátum</Form.Label>
                      <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="location">
                      <Form.Label>Miesto</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ihrisko, štadión..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                      <Form.Label>Popis</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Krátky popis tréningu..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button type="submit" variant="primary" onClick={handleCreate}>
                        Uložiť tréning
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
}
