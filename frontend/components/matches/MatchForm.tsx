"use client";

import { Button, Form, Stack } from "react-bootstrap";
import type { MatchUpdateDto } from "@/types/match";

export default function MatchForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  saving,
}: {
  value: MatchUpdateDto;
  onChange: (name: keyof MatchUpdateDto, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Dátum a čas</Form.Label>
        <Form.Control
          type="datetime-local"
          value={value.date}
          onChange={(e) => onChange("date", e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Miesto</Form.Label>
        <Form.Control
          value={value.location}
          onChange={(e) => onChange("location", e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Súper</Form.Label>
        <Form.Control
          value={value.opponent}
          onChange={(e) => onChange("opponent", e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Výsledok</Form.Label>
        <Form.Control
          placeholder="napr. 2:1"
          value={value.result}
          onChange={(e) => onChange("result", e.target.value)}
        />
      </Form.Group>

      <Stack direction="horizontal" gap={2}>
        <Button variant="outline-secondary" onClick={onCancel} disabled={saving}>
          Zrušiť
        </Button>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Ukladám…" : "Uložiť"}
        </Button>
      </Stack>
    </Form>
  );
}
