import { Stack, ButtonGroup, Button } from "react-bootstrap";
import "@/styles/ListHeader.css";

type Mode = "all" | "upcoming";

type Props = {
  title: string;
  subtitle: string;
  mode: Mode;
  onModeChange: (m: Mode) => void;
  createLabel: string;
  onCreate: () => void;
};

export default function ListHeader({
  title,
  subtitle,
  mode,
  onModeChange,
  createLabel,
  onCreate,
}: Props) {
  return (
    <Stack
      direction="horizontal"
      className="listHeader justify-content-between align-items-start mb-3 mt-3"
    >
      <div>
        <h1 className="h3 mb-1">{title}</h1>
        <div className="text-muted">{subtitle}</div>
      </div>

      <Stack direction="horizontal" gap={2} className="listHeaderActions">
        <ButtonGroup className="listHeaderToggle">
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

        <Button variant="success" onClick={onCreate} className="listHeaderCreate">
          {createLabel}
        </Button>
      </Stack>
    </Stack>
  );
}
