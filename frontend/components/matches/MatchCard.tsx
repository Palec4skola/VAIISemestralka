"use client";

import Link from "next/link";
import { Badge, Card } from "react-bootstrap";
import type { MatchListItemDto } from "@/types/match";
import { useRouter } from "next/navigation";

function fmt(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("sk-SK"),
    time: d.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function MatchCard({ match }: { match: MatchListItemDto }) {
  const { date, time } = fmt(match.date);
  const played = (match.result ?? "").trim().length > 0;
    const router = useRouter();

  return (
      <Card className="mb-3 shadow-sm" onClick={() => router.push(`/matches/${match.id}`)}>
        <Card.Body className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <div className="text-muted small">
              {date} · {time} · {match.teamName}
            </div>
            <div className="fw-semibold fs-5 mt-1">vs {match.opponent}</div>
            <div className="text-muted mt-1">{match.location}</div>
          </div>

          <div className="text-end">
            {played ? (
              <Badge bg="success" className="fs-6">{match.result}</Badge>
            ) : (
              <Badge bg="warning" text="dark" className="fs-6">Nadchádzajúci</Badge>
            )}
          </div>
        </Card.Body>
      </Card>
  );
}
