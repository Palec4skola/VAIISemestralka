"use client";

import { Badge, Card } from "react-bootstrap";
import type { MatchListItemDto } from "@/types/match";
import { useRouter } from "next/navigation";
import "@/styles/Match.css";

function fmt(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("sk-SK"),
    time: d.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function MatchCard({ match }: { match: MatchListItemDto }) {
  const { date, time } = fmt(match.date);
  const played = match.date <= new Date().toISOString();
  const router = useRouter();

  return (
    <Card
      className="matchCard mb-3 shadow-sm"
      onClick={() => router.push(`/matches/${match.id}`)}
      role="button"
      tabIndex={0}
    >
      <Card.Body className="matchBody d-flex justify-content-between align-items-start gap-3">
        <div className="matchMain">
          <div className="matchMeta">
            {date} · {time} · {match.name}
          </div>
          <div className="matchTitle">
            {match.name} vs {match.opponent}
          </div>
          <div className="matchSub">{match.location}</div>
        </div>

        <div className="text-end matchBadgeWrap">
          {played ? (
            <Badge bg="success" className="matchBadge">
              {match.result}
            </Badge>
          ) : (
            <Badge bg="warning" text="dark" className="matchBadge">
              Nadchádzajúci
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
