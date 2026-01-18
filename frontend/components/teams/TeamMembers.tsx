import { Card, ListGroup, Button, Row, Col } from "react-bootstrap";
import { Trash, Plus } from "react-bootstrap-icons";
import { Member } from "@/types/member";

type Props = {
  members: Member[];
  isCoach: boolean;
  onInvite: () => void;
  onKick: (id: number) => void;
};

export default function TeamMembersList({
  members,
  isCoach,
  onInvite,
  onKick,
}: Props) {
  return (
  <Card className="shadow-sm">
    <Card.Header className="d-flex justify-content-between align-items-center">
      <strong>Členovia tímu</strong>

      {isCoach && (
        <Button size="sm" variant="outline-success" onClick={onInvite}>
          <Plus /> Pridať hráča
        </Button>
      )}
    </Card.Header>

    <ListGroup variant="flush">
      {members.map((m) => (
        <ListGroup.Item key={m.id}>
          <Row className="align-items-center g-2">

            <Col xs={10} md={4} className="fw-medium">
              {m.name}

              <span className="ms-2 d-inline d-md-none">
                <span className="badge bg-secondary">{m.role}</span>
              </span>

              <div className="text-muted small d-block d-md-none">
                {m.email}
              </div>
            </Col>

            <Col md={3} className="d-none d-md-block">
              {m.role}
            </Col>

            <Col lg={4} className="text-muted d-none d-lg-block">
              {m.email}
            </Col>

            {isCoach && (
              <Col xs={2} md={1} className="text-end">
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onKick(m.id)}
                >
                  <Trash />
                </Button>
              </Col>
            )}
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </Card>
);
}
