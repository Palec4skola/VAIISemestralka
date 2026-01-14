import TrainingCard from "./TrainingCard";
import { TrainingListItem } from "@/types/training";

type Props = {
  trainings: TrainingListItem[];
};

export default function TrainingsList({ trainings }: Props) {
  if (trainings.length === 0) {
    return <p className="text-muted">Žiadne nadchádzajúce tréningy.</p>;
  }

  return (
    <>
      {trainings.map((t) => (
        <TrainingCard key={t.id} training={t} />
      ))}
    </>
  );
}
