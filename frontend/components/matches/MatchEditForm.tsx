"use client";

import { Card, Form, Button } from "react-bootstrap";
import type { MatchUpdateDto } from "@/types/match";

type Props = {
  form: MatchUpdateDto;
  onChange: (field: keyof MatchUpdateDto, value: string) => void;
  onSubmit: () => void;
  saving?: boolean;
};

export default function EditMatchForm({ form, onChange, onSubmit, saving = false }: Props) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Form.Group className="mb-4">
            <Form.Label>Dátum a čas</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.date}
              onChange={(e) => onChange("date", e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Miesto</Form.Label>
            <Form.Control
              value={form.location}
              onChange={(e) => onChange("location", e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Súper</Form.Label>
            <Form.Control
              value={form.opponent}
              onChange={(e) => onChange("opponent", e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Výsledok</Form.Label>
            <Form.Control
              placeholder='napr. "2:1" (nechaj prázdne ak ešte neodohrané)'
              value={form.result}
              onChange={(e) => onChange("result", e.target.value)}
            />
          </Form.Group>

          <Button type="submit" className="w-100" disabled={saving}>
            {saving ? "Ukladám..." : "Uložiť zmeny"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
