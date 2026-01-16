"use client";

import { Alert, Col, Container, Row } from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import MatchesHeader from "@/components/matches/MatchesHeader";
import MatchesList from "@/components/matches/MatchesList";
import { useMatches } from "@/hooks/matches/useMatches";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
  const router = useRouter();
  const { matches, mode, setMode, loading, error } = useMatches();

  // TODO: neskôr napoj na rolu
  const canCreate = true;

  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col>
          <MatchesHeader
            mode={mode}
            onModeChange={setMode}
            onCreate={() => router.push("/matches/create")}
            canCreate={canCreate}
          />

          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <MatchesList matches={matches} loading={loading} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
