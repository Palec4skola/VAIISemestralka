"use client";

import { Alert, Col, Container, Row } from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import TrainingsHeader from "@/components/trainings/TrainingHeader";
import TrainingsList from "@/components/trainings/TrainingsList";
import { useTrainings } from "@/hooks/trainings/useTrainings";
import { useRouter } from "next/navigation";

export default function TrainingsPage() {
  const router = useRouter();
  const { trainings, mode, setMode, error } = useTrainings();

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col className="ps-3 ps-md-4">
          <TrainingsHeader
            mode={mode}
            onModeChange={setMode}
            onCreate={() => router.push("/trainings/create")}
          />

          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="justify-content-center g-0">
            <Col xs={12} md={10} lg={8}>
              <TrainingsList trainings={trainings} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
