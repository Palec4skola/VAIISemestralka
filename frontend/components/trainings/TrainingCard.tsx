import { Card, Badge } from "react-bootstrap";
import Link from "next/link";
import { TrainingListItem } from "@/types/training";

type Props = {
  training: TrainingListItem;
};

export default function TrainingCard({ training }: Props) {
  const date = new Date(training.date);

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body as={Link} href={`/trainings/${training.id}`} className="text-decoration-none text-dark">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1">
              {date.toLocaleDateString("sk-SK")}{" "}
              {date.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" })}
            </Card.Title>

            <Card.Subtitle className="text-muted mb-2">
              {training.teamName}
            </Card.Subtitle>
          </div>

          <Badge bg="secondary">Tréning</Badge>
        </div>

        <div className="fw-semibold">{training.location}</div>

        {training.description && (
          <div className="text-muted mt-2">{training.description}</div>
        )}
      </Card.Body>
    </Card>
  );
}
