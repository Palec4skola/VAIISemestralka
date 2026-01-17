"use client";

import { Button, ButtonGroup, Stack } from "react-bootstrap";

export default function TrainingHeader({
  mode,
  onModeChange,
  onCreate,
}: {
  mode: "all" | "upcoming";
  onModeChange: (m: "all" | "upcoming") => void;
  onCreate: () => void;
}) {
  return (
    <Stack direction="horizontal" className="justify-content-between align-items-start mb-3 mt-3">
      <div>
        <h1 className="h3 mb-1">Tréningy</h1>
        <div className="text-muted">Prehľad tréningov v tvojich tímoch</div>
      </div>

      <Stack direction="horizontal" gap={2}>
        <ButtonGroup>
          <Button
            variant={mode === "all" ? "primary" : "outline-primary"}
            onClick={() => onModeChange("all")}
          >
            Všetky
          </Button>
          <Button
            variant={mode === "upcoming" ? "primary" : "outline-primary"}
            onClick={() => onModeChange("upcoming")}
          >
            Nadchádzajúce
          </Button>
        </ButtonGroup>

        <Button variant="success" onClick={onCreate}>
          + Pridať tréning
        </Button>
      </Stack>
    </Stack>
  );
}
