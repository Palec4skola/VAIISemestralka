"use client";

import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { Card, Container, Row, Col } from "react-bootstrap";
import MatchCreateForm from "@/components/matches/MatchCreateForm";
import { useCreateMatch } from "@/hooks/matches/useCreateMatch";

export default function CreateMatchPage() {
  const router = useRouter();
  const { create, loading, error } = useCreateMatch();

  const handleSubmit = async (data: {
    teamId: number;
    dateIsoUtc: string;
    location: string;
    opponent: string;
    result: string;
  }) => {
    const ok = await create(data);
    if (ok) router.push("/matches");
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <main className="flex-grow-1 p-3">
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <h1 className="h3">Vytvoriť zápas</h1>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <MatchCreateForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    apiError={error}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
}
