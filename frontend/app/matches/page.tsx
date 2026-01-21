"use client";

import { Alert, Col, Container, Row } from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import MatchesList from "@/components/matches/MatchesList";
import { useMatches } from "@/hooks/matches/useMatches";
import { useRouter } from "next/navigation";
import ListHeader from "@/components/common/ListHeader";

export default function MatchesPage() {
  const router = useRouter();
  const { matches, mode, setMode, loading, error } = useMatches();

  return (
    <Container fluid className="p-0 ">
      <Row className="g-0">
        <Col xs="auto" className="p-0 ">
          <Sidebar />
        </Col>

        <Col className="ps-3 ps-md-4 ">
            <ListHeader
              title="Zápasy"
              subtitle="Prehľad zápasov v tvojich tímoch"
              mode={mode}
              onModeChange={setMode}
              createLabel="+ Pridať zápas"
              onCreate={() => router.push("/matches/create")}
            />

          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="justify-content-center g-0">
            <Col xs={12} md={10} lg={8}>
              <MatchesList matches={matches} loading={loading} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
