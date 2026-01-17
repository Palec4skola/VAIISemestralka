"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
  Button,
  Stack,
} from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import { useTrainingDetail } from "@/hooks/trainings/useTrainingDetail";
import { useEventAttendance } from "@/hooks/attendance/useEventAttendance";
import { useAddAttendance } from "@/hooks/attendance/useAddAttendance";
import EventAttendanceTable from "@/components/attendance/EventAttendanceTable";
import { getUserIdFromToken } from "@/lib/jwt";
import { AttendanceStatus } from "@/types/attendance";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const myUserId = useMemo(() => getUserIdFromToken(), []);
  const router = useRouter();
  const { training, loading, error } = useTrainingDetail(id);

  const attendance = useEventAttendance("Training", training?.id);
  const upsert = useAddAttendance();

  const isCoach = training?.role === "Coach";

  const handleSave = async (
    userId: number,
    status: AttendanceStatus,
    reason?: string,
  ) => {
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
      <Row className="g-0">
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col className="ps-3 py-3 ps-md-4">
        <Stack
            direction="horizontal"
            className="justify-content-between align-items-start mb-3"
          >
            <div>
              <h1 className="h3 mb-1">Detail tréningu</h1>
              <div className="text-muted">Informácie o tréningu</div>
            </div>

          <Stack direction="horizontal" gap={2}>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => router.back()}
            >
              Späť
            </Button>

            {isCoach && (
              <>
                <Button
                  variant="outline-warning"
                  size="sm"
                  title="Upraviť tréning"
                  onClick={() => router.push(`/trainings/${id}/edit`)}
                  className="d-flex align-items-center"
                >
                  <PencilSquare size={16} />
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  title="Zmazať tréning"
                  className="d-flex align-items-center"
                >
                  <Trash size={16} />
                </Button>
              </>
            )}
          </Stack>
          </Stack>

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
                        {new Date(training.date).toLocaleTimeString("sk-SK", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
