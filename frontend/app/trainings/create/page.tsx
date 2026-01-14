"use client";

import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { Card, Container, Row, Col } from "react-bootstrap";
import TrainingCreateForm from "@/components/trainings/TrainingCreateForm";
import { useCreateTraining } from "@/hooks/trainings/useCreateTraining";

export default function CreateTrainingPage() {
  const router = useRouter();
  const { create, loading, error } = useCreateTraining();

  const handleSubmit = async (data: {
    teamId: number;
    dateIsoUtc: string;
    location: string;
    description: string;
  }) => {
    const ok = await create(data);
    if (ok) router.push("/trainings");
  };

  return (
    <div className="d-flex">
      <Sidebar/>

      <main className="flex-grow-1 p-3">
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <h1 className="h3">Vytvoriť tréning</h1>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <TrainingCreateForm
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
