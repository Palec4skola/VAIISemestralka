"use client";

import { Card, Form, Button, Alert } from "react-bootstrap";
import type { CreateTeamFormState } from "@/hooks/team/useCreateTeam";

type Props = {
  form: CreateTeamFormState;
  countries: string[];
  error?: string;
  loading?: boolean;
  onChange: (field: keyof CreateTeamFormState, value: string) => void;
  onSubmit: () => void;
};

export default function CreateTeamForm({
  form,
  countries,
  error = "",
  loading = false,
  onChange,
  onSubmit,
}: Props) {
  return (
    <Card style={{ maxWidth: 400, width: "100%" }} className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">Vytvorenie tímu</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Form.Group className="mb-3" controlId="teamName">
            <Form.Label>Názov tímu</Form.Label>
            <Form.Control
              type="text"
              placeholder="Názov tímu"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="teamDescription">
            <Form.Label>Popis tímu</Form.Label>
            <Form.Control
              type="text"
              placeholder="Popis tímu"
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="teamCountry">
            <Form.Label>Krajina</Form.Label>
            <Form.Select
              value={form.country}
              onChange={(e) => onChange("country", e.target.value)}
            >
              <option value="">-- Vyber krajinu --</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Vytváram..." : "Vytvoriť tím"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
