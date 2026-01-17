"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Alert, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import MatchForm from "@/components/matches/MatchForm";
import { useEditMatchForm } from "@/hooks/matches/useEditMatch";

export default function EditMatchPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const matchId = Number(id);

  const { form, updateField, loading, saving, error, submit } = useEditMatchForm(matchId);

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) router.push(`/matches/${matchId}`);
  };

  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col className="py-3">
          <h1 className="h3 mb-3">Upraviť zápas</h1>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="d-flex align-items-center gap-2 text-muted">
              <Spinner animation="border" size="sm" />
              Načítavam…
            </div>
          ) : (
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <MatchForm
                      value={form}
                      onChange={updateField}
                      onSubmit={handleSubmit}
                      onCancel={() => router.back()}
                      saving={saving}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}
