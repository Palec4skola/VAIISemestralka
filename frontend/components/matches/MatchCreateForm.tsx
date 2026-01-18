"use client";

import { useMemo, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useTeams } from "@/hooks/team/useTeams";
import TeamSelectCard from "../teams/TeamSelectCard";

type Props = {
  onSubmit: (data: {
    teamId: number;
    dateIsoUtc: string;
    location: string;
    opponent: string;
    result: string;
  }) => Promise<void>;
  loading?: boolean;
  apiError?: string;
};

export default function MatchCreateForm({
  onSubmit,
  loading = false,
  apiError = "",
}: Props) {
  const { teams } = useTeams();

  const coachTeams = useMemo(
    () => teams.filter((t) => t.role === "Coach"),
    [teams],
  );

  const [teamId, setTeamId] = useState<number>(0);
  const [dateLocal, setDateLocal] = useState("");
  const [location, setLocation] = useState("");
  const [opponent, setOpponent] = useState("");
  const [result, setResult] = useState("");

  const [clientError, setClientError] = useState("");

  const minDateTimeLocal = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate(),
    )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }, []);

  const validate = () => {
    if (!teamId || teamId <= 0) {
      setClientError("Vyber tím.");
      return false;
    }
    if (!dateLocal) {
      setClientError("Vyplň dátum a čas zápasu.");
      return false;
    }
    if (!location.trim()) {
      setClientError("Vyplň miesto zápasu.");
      return false;
    }
    if (!opponent.trim()) {
      setClientError("Vyplň súpera.");
      return false;
    }

    const selected = new Date(dateLocal);
    const now = new Date();
    if (selected < now) {
      setClientError("Zápas nemôže byť v minulosti.");
      return false;
    }

    // result je voliteľný (prázdny = upcoming)
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
      opponent: opponent.trim(),
      result: result.trim(), // "" ok
    });
  };

  const combinedError = clientError || apiError;

  return (
    <Form onSubmit={handleSubmit}>
      {combinedError && <Alert variant="danger">{combinedError}</Alert>}

      <Form.Group className="mb-0" controlId="teamId">
        <TeamSelectCard
          teams={coachTeams}
          value={teamId}
          onChange={setTeamId}
        />
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
          placeholder="Štadión, ihrisko..."
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="opponent">
        <Form.Label>Súper</Form.Label>
        <Form.Control
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          placeholder="Názov súpera..."
          required
        />
      </Form.Group>

      <Form.Group className="mb-4" controlId="result">
        <Form.Label>Výsledok (voliteľné)</Form.Label>
        <Form.Control
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder='napr. "2:1" (nechaj prázdne pre nadchádzajúci zápas)'
        />
      </Form.Group>

      <div className="d-grid">
        <Button type="submit" disabled={loading || coachTeams.length === 0}>
          {loading ? "Ukladám…" : "Uložiť zápas"}
        </Button>
      </div>
    </Form>
  );
}
