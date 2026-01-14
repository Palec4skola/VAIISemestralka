"use client";

import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useUpcomingTrainings } from "@/hooks/trainings/useUpcomingTrainings";
import TrainingsList from "@/components/trainings/TrainingsList";

export default function TrainingsPage() {
  const router = useRouter();
  const { trainings, loading, error } = useUpcomingTrainings();

  return (
    <Container fluid>
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar/>
        </Col>

        <Col className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3">Tréningy</h1>

            <Button onClick={() => router.push("/trainings/create")}>
              + Pridať tréning
            </Button>
          </div>

          {loading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner size="sm" />
              <span>Načítavam tréningy…</span>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <TrainingsList trainings={trainings} />
          )}
        </Col>
      </Row>
    </Container>
  );
}
