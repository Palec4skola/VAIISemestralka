"use client";

import Sidebar from "@/components/Sidebar";
import JoinTeamForm from "@/components/teams/JoinTeamForm";
import { useJoinTeam } from "@/hooks/team/useJoinTeam";
import { Container, Row, Col } from "react-bootstrap";

export default function JoinTeamPage() {
  const { code, updateCode, loading, error, success, submit } = useJoinTeam();

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col className="py-3 ps-3 ps-md-4">
          <Row className="justify-content-center g-0 mt-4">
            <Col xs={12} md={6} lg={4}>
              <JoinTeamForm
                code={code}
                loading={loading}
                error={error}
                success={success}
                onCodeChange={updateCode}
                onSubmit={submit}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
