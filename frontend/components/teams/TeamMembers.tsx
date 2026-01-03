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
      <Card.Header className="d-flex justify-content-between">
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
            <Row>
              <Col md={4}>{m.name}</Col>
              <Col md={3}>{m.role}</Col>
              <Col md={4} className="text-muted">{m.email}</Col>
              {isCoach && (
                <Col md={1}>
                  <Button size="sm" variant="outline-danger" onClick={() => onKick(m.id)}>
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
