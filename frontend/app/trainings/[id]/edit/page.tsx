"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import EditTrainingForm from "@/components/trainings/TrainingEditForm";
import { useEditTraining } from "@/hooks/trainings/useEditTraining";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";

export default function EditTrainingPage() {
  const params = useParams<{ id: string }>();

  const {
    training,
    form,
    loading,
    saving,
    error,
    success,
    updateField,
    submit,
  } = useEditTraining(params.id);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />

      <main className="flex-grow-1">
        <header className="bg-light border-bottom p-3">
          <h1 className="h3 mb-0">Upraviť tréning</h1>

          {training && (
            <div className="text-muted small mt-1">
              {training.location}
            </div>
          )}
        </header>

        <Container className="py-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {loading && <Spinner />}

          {form && (
            <Row className="justify-content-center g-0">
              <Col md={8} lg={6}>
                <EditTrainingForm
                  form={form}
                  onChange={updateField}
                  onSubmit={submit}
                  saving={saving}
                />
              </Col>
            </Row>
          )}
        </Container>
      </main>
    </div>
  );
}
