"use client";

import { useMemo, useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useTeams } from "@/hooks/team/useTeams";

type Props = {
  onSubmit: (data: {
    teamId: number;
    dateIsoUtc: string;
    location: string;
    description: string;
  }) => Promise<void>;
  loading?: boolean;
  apiError?: string;
};

export default function TrainingCreateForm({ onSubmit, loading = false, apiError = "" }: Props) {
  const { teams } = useTeams();

  const coachTeams = useMemo(
    () => teams.filter((t) => t.role === "Coach"),
    [teams]
  );

  const [teamId, setTeamId] = useState<number>(0);
  const [dateLocal, setDateLocal] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [clientError, setClientError] = useState("");

  const minDateTimeLocal = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`;
  }, []);

  const validate = () => {
    if (!teamId || teamId <= 0) {
      setClientError("Vyber tím.");
      return false;
    }
    if (!dateLocal) {
      setClientError("Vyplň dátum a čas tréningu.");
      return false;
    }
    if (!location.trim()) {
      setClientError("Vyplň miesto tréningu.");
      return false;
    }

    const selected = new Date(dateLocal);
    const now = new Date();
    if (selected < now) {
      setClientError("Tréning nemôže byť v minulosti.");
      return false;
    }

    setClientError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      teamId,
      dateIsoUtc: new Date(dateLocal).toISOString(),
      location: location.trim(),
      description: description.trim(),
    });
  };

  const combinedError = clientError || apiError;

  return (
    <Form onSubmit={handleSubmit}>
      {combinedError && <Alert variant="danger">{combinedError}</Alert>}

      <Form.Group className="mb-3" controlId="teamId">
        <Form.Label>Tím</Form.Label>

        
          <Form.Select
            value={teamId}
            onChange={(e) => setTeamId(Number(e.target.value))}
            required
          >
            <option value={0}>-- Vyber tím --</option>

            {coachTeams.map((t) => (
              <option key={t.teamId} value={t.teamId}>
                {t.name}
              </option>
            ))}
          </Form.Select>
    

        {coachTeams.length === 0 && (
          <Form.Text className="text-muted">
            Nemáš žiadny tím, kde si Coach.
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="dateTime">
        <Form.Label>Dátum a čas</Form.Label>
        <Form.Control
          type="datetime-local"
          value={dateLocal}
          min={minDateTimeLocal}
          onChange={(e) => setDateLocal(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="location">
        <Form.Label>Miesto</Form.Label>
        <Form.Control
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ihrisko, štadión..."
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Popis</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Krátky popis tréningu..."
        />
      </Form.Group>

      <div className="d-grid">
        <Button type="submit" disabled={loading || coachTeams.length === 0}>
          {loading ? "Ukladám…" : "Uložiť tréning"}
        </Button>
      </div>
    </Form>
  );
}
