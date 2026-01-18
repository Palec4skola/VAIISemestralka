"use client";

import { Card } from "react-bootstrap";
import type { TrainingDetail } from "@/types/training";

type Props = {
  training: TrainingDetail;
};

export default function TrainingDetailCard({ training }: Props) {
  const d = new Date(training.date);
  const date = d.toLocaleDateString("sk-SK");
  const time = d.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <div className="fw-semibold">
              {date} {time}
            </div>
            <div className="text-muted">{training.name}</div>
          </div>
        </div>

        <div className="mt-3">
          <div className="fw-semibold">Miesto</div>
          <div>{training.location}</div>
        </div>

        {training.description && (
          <div className="mt-3">
            <div className="fw-semibold">Popis</div>
            <div className="text-muted">{training.description}</div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
