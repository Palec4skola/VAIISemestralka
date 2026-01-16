"use client";

import { Spinner } from "react-bootstrap";
import type { MatchListItemDto } from "@/types/match";
import MatchCard from "./MatchCard";

export default function MatchesList({
  matches,
  loading,
}: {
  matches: MatchListItemDto[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <Spinner animation="border" size="sm" />
        Načítavam zápasy…
      </div>
    );
  }

  if (matches.length === 0) {
    return <div className="text-muted">Zatiaľ tu nie sú žiadne zápasy.</div>;
  }

  return (
    <div>
      {matches.map((m) => (
        <MatchCard key={m.id} match={m} />
      ))}
    </div>
  );
}
