import { Card, ListGroup } from "react-bootstrap";
import TeamItem from "./TeamItem";
import { Team } from "@/types/team";

type Props = {
  teams: Team[];
  onDelete: (id: number) => void;
};

export default function TeamList({ teams, onDelete }: Props) {
  return (
    <Card className="shadow-sm">
      <Card.Header>
        <strong>Zoznam tímov</strong>
      </Card.Header>

      <ListGroup variant="flush">
        {teams && teams.length > 0 ? (
          teams.map((team) => (
            <ListGroup.Item key={team.teamId}>
              <TeamItem team={team} onDelete={onDelete} />
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item key="empty">
            Žiadne tímy neboli nájdené.
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
}
