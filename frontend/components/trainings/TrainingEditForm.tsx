"use client";

import { Card, Form, Button } from "react-bootstrap";
import type { TrainingUpdateDto } from "@/types/training";

type Props = {
  form: TrainingUpdateDto;
  onChange: (field: keyof TrainingUpdateDto, value: string) => void;
  onSubmit: () => void;
  saving?: boolean;
};

export default function EditTrainingForm({
  form,
  onChange,
  onSubmit,
  saving = false,
}: Props) {
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
            <Form.Label>Popis</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Voliteľné – napr. zameranie tréningu, poznámky"
              value={form.description ?? ""}
              onChange={(e) => onChange("description", e.target.value)}
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
