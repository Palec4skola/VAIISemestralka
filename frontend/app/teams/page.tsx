"use client";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import TeamList from "@/components/teams/TeamList";
import { useTeams } from "@/hooks/team/useTeams";

export default function TeamPage() {
  const { teams, error, deleteTeam } = useTeams();

  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col>
          <h1 className="h3 mb-4">Tímy</h1>

          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <TeamList teams={teams} onDelete={deleteTeam} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
