"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type Team = {
  id: number;
  name: string;
  description: string;
  country: string;
  coachId: number;
};

export default function EditTeamPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const teamId = params.id;

  const [form, setForm] = useState<Team | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!response.ok) {
          setError(await response.text());
          return;
        }
        const data: Team = await response.json();
        setForm(data);
      } catch {
        setError("Server nie je dostupný");
      }
    };

    if (teamId) fetchTeam();
  }, [teamId]);

  const handleChange =
    (field: keyof Team) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!form) return;
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setError("");
    setSuccess("");

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`${API_URL}/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          country: form.country,
          coachId: form.coachId,
        }),
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setSuccess("Tím bol upravený.");
      router.push(`/teams/${teamId}`);
    } catch {
      setError("Server nie je dostupný");
    }
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar - zachovávaš svoj */}
      <Sidebar selected="Tím" setSelected={() => {}} />

      {/* Main content */}
      <main className="flex-grow-1">
        <header className="bg-light border-bottom p-3">
          <h1 className="h3 mb-0">Upraviť tím</h1>
        </header>

        <Container className="py-4">
          {/* Error/Success alerts */}
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4">
              {success}
            </Alert>
          )}

          {/* Form card */}
          {form && (
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <Card>
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-4" controlId="name">
                        <Form.Label>Názov tímu</Form.Label>
                        <Form.Control
                          type="text"
                          value={form.name}
                          onChange={handleChange("name")}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="description">
                        <Form.Label>Popis</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={form.description}
                          onChange={handleChange("description")}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="country">
                        <Form.Label>Krajina</Form.Label>
                        <Form.Control
                          type="text"
                          value={form.country}
                          onChange={handleChange("country")}
                        />
                      </Form.Group>

                      <Button type="submit" variant="primary" className="w-100">
                        Uložiť zmeny
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </main>
    </div>
  );
}
