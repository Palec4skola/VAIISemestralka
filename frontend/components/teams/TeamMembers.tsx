import { Card, ListGroup, Button, Row, Col } from "react-bootstrap";
import { Trash, Plus } from "react-bootstrap-icons";
import { Member } from "@/types/member";
import "@/styles/Team.css";

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
  <Card className="memberCard shadow-sm">
    <Card.Header className="memberHeader">
      <strong>Členovia tímu</strong>

      {isCoach && (
        <Button
          size="sm"
          variant="outline-success"
          onClick={onInvite}
          className="inviteBtn"
        >
          <Plus /> Pridať hráča
        </Button>
      )}
    </Card.Header>

    <ListGroup variant="flush">
      {members.map((m) => (
        <ListGroup.Item key={m.id} className="memberItem">
          <Row className="align-items-center g-2 memberRow">

            <Col xs={10} md={4} className="memberName">
              {m.name}

              <span className="ms-2 d-inline d-md-none">
                <span className="badge bg-secondary">{m.role}</span>
              </span>

              <div className="memberEmailMobile d-md-none">
                {m.email}
              </div>
            </Col>

            <Col md={3} className="d-none d-md-block memberRole">
              {m.role}
            </Col>

            <Col lg={4} className="d-none d-lg-block memberEmail">
              {m.email}
            </Col>

            {isCoach && (
              <Col xs={2} md={1} className="text-end">
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onKick(m.id)}
                  className="kickBtn"
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
