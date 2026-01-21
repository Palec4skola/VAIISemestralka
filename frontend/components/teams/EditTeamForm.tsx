import { Card, Form, Button } from "react-bootstrap";
import { Team } from "@/types/team";
import "@/styles/Team.css";

type Props = {
  team: Team;
  onChange: (field: keyof Team, value: string) => void;
  onSubmit: () => void;
};

export default function EditTeamForm({ team, onChange, onSubmit }: Props) {
  return (
  <Card className="teamFormCard">
    <Card.Body className="teamFormBody">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Form.Group className="mb-4">
          <Form.Label className="teamFormLabel">Názov tímu</Form.Label>
          <Form.Control
            className="teamFormInput"
            placeholder={team.name}
            value={team.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="teamFormLabel">Popis</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            className="teamFormInput"
            value={team.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="teamFormLabel">Krajina</Form.Label>
          <Form.Control
            className="teamFormInput"
            value={team.country}
            onChange={(e) => onChange("country", e.target.value)}
          />
        </Form.Group>

        <Button type="submit" className="teamFormSubmit w-100">
          Uložiť zmeny
        </Button>
      </Form>
    </Card.Body>
  </Card>
);
}
