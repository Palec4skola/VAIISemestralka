"use client";

import { Badge, Card, Stack } from "react-bootstrap";
import type { MatchDetailDto } from "@/types/match";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("sk-SK", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const time = d.toLocaleTimeString("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

type Props = {
  match: MatchDetailDto;
};

export default function MatchDetailCard({ match }: Props) {
  const { date, time } = formatDateTime(match.date);
  const hasResult = (match.result ?? "").trim().length > 0;

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Stack
          direction="horizontal"
          className="justify-content-between align-items-start"
        >
          <div>
            <div className="text-muted small">
              {date} · {time}
            </div>
            <div className="mt-1 fw-semibold fs-4">
              {match.name} vs {match.opponent}
            </div>
          </div>

          <div className="text-end">
            {hasResult ? (
              <Badge bg="success" className="fs-6">
                {match.result}
              </Badge>
            ) : (
              <Badge bg="warning" text="dark" className="fs-6">
                Nadchádzajúci
              </Badge>
            )}
          </div>
        </Stack>

        <hr className="my-3" />

        <div className="d-flex flex-column gap-2">
          <div>
            <span className="text-muted">Miesto: </span>
            <span className="fw-medium">{match.location}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
