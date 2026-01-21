import { Card, ListGroup } from "react-bootstrap";
import TeamItem from "./TeamItem";
import { Team } from "@/types/team";
import "@/styles/Team.css";

type Props = {
  teams: Team[];
  onDelete: (id: number) => void;
};

export default function TeamList({ teams, onDelete }: Props) {
  return (
  <Card className="teamCard shadow-sm">
    <Card.Header className="teamCardHeader">
      <strong>Zoznam tímov</strong>
    </Card.Header>

    <ListGroup variant="flush" className="teamList">
      {teams && teams.length > 0 ? (
        teams.map((team) => (
          <ListGroup.Item key={team.teamId} className="teamListItem">
            <TeamItem team={team} onDelete={onDelete} />
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item key="empty" className="teamListEmpty">
          Žiadne tímy neboli nájdené.
        </ListGroup.Item>
      )}
    </ListGroup>
  </Card>
);

}
