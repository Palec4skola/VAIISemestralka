"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Container, Row, Col, Alert, Spinner, Card } from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import { useTrainingDetail } from "@/hooks/trainings/useTrainingDetail";
import { useEventAttendance } from "@/hooks/attendance/useEventAttendance";
import { useAddAttendance } from "@/hooks/attendance/useAddAttendance";
import EventAttendanceTable from "@/components/attendance/EventAttendanceTable";
import { getUserIdFromToken } from "@/lib/jwt";
import { AttendanceStatus } from "@/types/attendance";

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const myUserId = useMemo(() => getUserIdFromToken(), []);

  const { training, loading, error } = useTrainingDetail(id);

  const attendance = useEventAttendance("Training", training?.id);
  const upsert = useAddAttendance();

  const isCoach = training?.myRole === "Coach";

  const handleSave = async (userId: number, status: AttendanceStatus, reason?: string) => {
    if (!training) return;

    const ok = await upsert.upsert({
      eventType: "Training",
      eventId: training.id,
      status,
      absenceReason: status === "Absent" ? (reason ?? "") : "",
      userId: isCoach ? userId : undefined, // player neposiela userId
    });

    if (ok) {
      await attendance.refetch(); // obnovíme dochádzku
    }
  };

  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col className="p-4">
          <h1 className="h3 mb-4">Detail tréningu</h1>

          {loading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner size="sm" />
              <span>Načítavam…</span>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {training && (
            <>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="fw-semibold">
                        {new Date(training.date).toLocaleDateString("sk-SK")}{" "}
                        {new Date(training.date).toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-muted">{training.name}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="fw-semibold">Miesto</div>
                    <div>{training.location}</div>
                  </div>

                  {training.description && (
                    <div className="mt-3">
                      <div className="fw-semibold">Popis</div>
                      <div className="text-muted">{training.description}</div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              <h2 className="h5 mb-3">Dochádzka</h2>

              {attendance.loading && (
                <div className="d-flex align-items-center gap-2">
                  <Spinner size="sm" />
                  <span>Načítavam dochádzku…</span>
                </div>
              )}

              {!attendance.loading && (
                <EventAttendanceTable
                  items={attendance.items}
                  isCoach={!!isCoach}
                  myUserId={myUserId}
                  saving={upsert.loading}
                  error={attendance.error || upsert.error}
                  onSave={handleSave}
                />
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
