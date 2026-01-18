"use client";

import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap";

type Props = {
  code: string;
  loading: boolean;
  error?: string;
  success?: string;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
};

export default function JoinTeamForm({
  code,
  loading,
  error = "",
  success = "",
  onCodeChange,
  onSubmit,
}: Props) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-2 text-center">Pripojiť sa k tímu</Card.Title>
        <Card.Text className="text-muted text-center mb-4">
          Zadaj 4-miestny kód, ktorý si dostal od trénera
        </Card.Text>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Form.Group className="mb-3" controlId="join-code">
            <Form.Label>Kód tímu</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                maxLength={4}
                placeholder="AB12"
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                autoComplete="off"
              />
            </InputGroup>
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              disabled={code.length < 4 || loading}
            >
              {loading ? "Pripájanie..." : "Join Team"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
