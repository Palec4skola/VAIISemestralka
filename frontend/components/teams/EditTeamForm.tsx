import { Card, Form, Button } from "react-bootstrap";
import { Team } from "@/types/team";

type Props = {
  team: Team;
  onChange: (field: keyof Team, value: string) => void;
  onSubmit: () => void;
};

export default function EditTeamForm({ team, onChange, onSubmit }: Props) {
  return (
    <Card>
      <Card.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Form.Group className="mb-4">
            <Form.Label>Názov tímu</Form.Label>
            <Form.Control
            placeholder= {team.name}
              value={team.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Popis</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={team.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Krajina</Form.Label>
            <Form.Control
              value={team.country}
              onChange={(e) => onChange("country", e.target.value)}
            />
          </Form.Group>

          <Button type="submit" className="w-100">
            Uložiť zmeny
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
