"use client";

import { useParams, useRouter } from "next/navigation";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import { useTrainingDetail } from "@/hooks/trainings/useTrainingDetail";
import DetailHeader from "@/components/common/DetailHeader";
import TrainingDetailCard from "@/components/trainings/TrainingDetailCard";
import EventAttendanceSection from "@/components/attendance/EventAttendanceSection";
import { useDeleteTraining } from "@/hooks/trainings/useDeleteTraining";
import { useState } from "react";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { training, loading, error } = useTrainingDetail(id);

  const isCoach = training?.role === "Coach";
  const [showDelete, setShowDelete] = useState(false);
  const del = useDeleteTraining();

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col className="ps-3 py-3 ps-md-4">
          <DetailHeader
            title="Detail tréningu"
            subtitle="Informácie o tréningu"
            canEdit={!!isCoach}
            onEdit={() => router.push(`/trainings/${id}/edit`)}
            onDelete={() => setShowDelete(true)}
          />

          {loading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner size="sm" />
              <span>Načítavam…</span>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {training && (
            <>
            <Row className="justify-content-center g-0">
                <Col xs={12} md={10} lg={8}>
              <TrainingDetailCard training={training} />
              <EventAttendanceSection 
              eventType="Training" 
              eventId={training.id} 
              isCoach={!!isCoach}
               />
                </Col>
               </Row>

            </>
          )}
        </Col>
      </Row>
      <ConfirmDeleteModal
  show={showDelete}
  title="Zmazať tréning"
  body="Naozaj chceš zmazať tento tréning? Táto akcia sa nedá vrátiť späť."
  loading={del.loading}
  error={del.error}
  onClose={() => setShowDelete(false)}
  onConfirm={async () => {
    if (!training) return;
    const ok = await del.remove(training.id);
    if (ok) router.push("/trainings");
  }}
/>  
    </Container>
    
  );
}
