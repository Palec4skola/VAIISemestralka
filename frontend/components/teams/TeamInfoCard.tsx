import { Card, Row, Col, Button } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import { Team } from "@/types/team";

type Props = {
  team: Team;
  onEdit: () => void;
};

export default function TeamInfoCard({ team, onEdit }: Props) {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between">
        <div>
          <h5>{team.teamName}nejde mi nazov????????????????????????</h5>
          <small className="text-muted">{team.description}</small>
        </div>

        {team.myRole === "Coach" && (
          <Button size="sm" variant="outline-primary" onClick={onEdit}>
            <PencilSquare />
          </Button>
        )}
      </Card.Header>

      <Card.Body>
        <Row>
          <Col md={4} className="fw-semibold">Krajina</Col>
          <Col md={8}>{team.country}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
