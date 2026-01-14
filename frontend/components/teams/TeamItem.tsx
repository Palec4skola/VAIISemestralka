import { Button, Col, Row } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import { Team } from "@/types/team";

type Props = {
  team: Team;
  onDelete: (id: number) => void;
};

export default function TeamItem({ team, onDelete }: Props) {
  const router = useRouter();

  return (
    <Row className="align-items-center">
      <Col role="button" onClick={() => router.push(`/teams/${team.teamId}`)}>
        <div className="fw-semibold">{team.name}</div>
        <div className="text-muted small">{team.description}</div>
        <div className="text-muted small">Krajina: {team.country}</div>
      </Col>

      <Col xs="auto">
      {team.role === "Coach" ? (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(team.teamId)}
        >
          <Trash />
        </Button>
     ) : null}
      </Col>
    </Row>
  );
}
