"use client";

import { Button, ButtonGroup, Stack } from "react-bootstrap";
import type { MatchesMode } from "@/types/match";

export default function MatchesHeader({
  mode,
  onModeChange,
  onCreate,
  canCreate = true,
}: {
  mode: MatchesMode;
  onModeChange: (m: MatchesMode) => void;
  onCreate: () => void;
  canCreate?: boolean;
}) {
  return (
    <Stack direction="horizontal" className="justify-content-between align-items-start mb-3">
      <div>
        <h1 className="h3 mb-1">Zápasy</h1>
        <div className="text-muted">Prehľad zápasov v tvojich tímoch</div>
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

        {canCreate && (
          <Button variant="success" onClick={onCreate}>
            + Pridať zápas
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
