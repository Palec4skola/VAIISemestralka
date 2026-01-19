"use client";

import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

type Props = {
  email: string;
  name: string;
  onSubmit: (name: string) => void;
  saving?: boolean;
};

export function ProfileForm({ email, name, onSubmit, saving }: Props) {
  const [value, setValue] = useState(name);

  const isDirty = value !== name;

  return (
    <Card>
      <Card.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(value);
          }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control value={email} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meno</Form.Label>
            <Form.Control
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={60}
              required
            />
          </Form.Group>

          <Button type="submit" disabled={!isDirty || saving}>
            {saving ? "Ukladám…" : "Uložiť"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

