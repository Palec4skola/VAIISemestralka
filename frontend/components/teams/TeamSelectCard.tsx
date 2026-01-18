"use client";

import { Card, Form } from "react-bootstrap";
import { Team } from "@/types/team";

type Props = {
  teams: Team[];
  value: number;
  loading?: boolean;
  error?: string;
  onChange: (teamId: number) => void;
};

export default function TeamSelectCard({
  teams,
  value,
  loading = false,
  error = "",
  onChange,
}: Props) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Form.Group  controlId="teamId">
          <Form.Label>Tím</Form.Label>

          <Form.Select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={loading || teams.length === 0}
          >
            <option value={0}>-- Vyber tím --</option>
            {teams.map((t) => (
              <option key={t.teamId} value={t.teamId}>
                {t.name}
              </option>
            ))}
          </Form.Select>

          {error && <div className="text-danger small mt-2">{error}</div>}
        </Form.Group>
      </Card.Body>
    </Card>
  );
}
