import { Card, Badge } from "react-bootstrap";
import { TrainingListItem } from "@/types/training";
import { useRouter } from "next/navigation";
import "@/styles/Training.css";

type Props = {
  training: TrainingListItem;
};

export default function TrainingCard({ training }: Props) {
  const router = useRouter();
  const date = new Date(training.date);

  return (
  <Card
    className="trainingCard mb-3 shadow-sm"
    onClick={() => router.push(`/trainings/${training.id}`)}
    role="button"
    tabIndex={0}
  >
    <Card.Body className="trainingBody">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="trainingMain">
          <div className="trainingMeta">
            {date.toLocaleDateString("sk-SK")}{" "}
            {date.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" })}
          </div>

          <div className="trainingTitle">{training.name}</div>
          <div className="trainingLocation">{training.location}</div>

          {training.description && (
            <div className="trainingDesc">{training.description}</div>
          )}
        </div>

        <Badge bg="secondary" className="trainingBadge">Tréning</Badge>
      </div>
    </Card.Body>
  </Card>
);

}
