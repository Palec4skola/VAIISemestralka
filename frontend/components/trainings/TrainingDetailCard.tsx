import { Card, Badge } from "react-bootstrap";
import { TrainingDetail } from "@/types/training";

type Props = { training: TrainingDetail };

export default function TrainingDetailCard({ training }: Props) {
  const d = new Date(training.date);

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1">
              {d.toLocaleDateString("sk-SK")}{" "}
              {d.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" })}
            </Card.Title>
            <Card.Subtitle className="text-muted">{training.teamName}</Card.Subtitle>
          </div>

          <Badge bg="secondary">Tréning</Badge>
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
