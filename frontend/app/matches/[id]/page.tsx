"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Stack,
  Button,
} from "react-bootstrap";
import { useMatchDetail } from "@/hooks/matches/useMatchDetail";
import { PencilSquare, Trash } from "react-bootstrap-icons";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("sk-SK", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const time = d.toLocaleTimeString("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [showDelete, setShowDelete] = useState(false);
  const matchId = Number(params.id);

  const { match, loading, error } = useMatchDetail(matchId);
  const isCoach = match?.isCoachOfTeam === true;
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
              <h1 className="h3 mb-1">Detail zápasu</h1>
              <div className="text-muted">Informácie o zápase</div>
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
                    title="Upraviť zápas"
                    onClick={() => router.push(`/matches/${matchId}/edit`)}
                    className="d-flex align-items-center"
                  >
                    <PencilSquare size={16} />
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    title="Zmazať zápas"
                    onClick={() => setShowDelete(true)}
                    className="d-flex align-items-center"
                  >
                    <Trash size={16} />
                  </Button>
                </>
              )}
            </Stack>
          </Stack>

          {loading && (
            <div className="d-flex align-items-center gap-2 text-muted">
              <Spinner animation="border" size="sm" />
              Načítavam detail…
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && match && (
            <Row className="justify-content-center g-0">
              <Col xs={12} md={10} lg={8}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Stack
                      direction="horizontal"
                      className="justify-content-between align-items-start"
                    >
                      <div>
                        {(() => {
                          const { date, time } = formatDateTime(match.date);
                          return (
                            <>
                              <div className="text-muted small">
                                {date} · {time}
                              </div>
                              <div className="mt-1 fw-semibold fs-4">
                                {match.name} vs {match.opponent}
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="text-end">
                        {(match.result ?? "").trim() ? (
                          <Badge bg="success" className="fs-6">
                            {match.result}
                          </Badge>
                        ) : (
                          <Badge bg="warning" text="dark" className="fs-6">
                            Nadchádzajúci
                          </Badge>
                        )}
                      </div>
                    </Stack>

                    <hr className="my-3" />

                    <div className="d-flex flex-column gap-2">
                      <div>
                        <span className="text-muted">Miesto: </span>
                        <span className="fw-medium">{match.location}</span>
                      </div>
                    </div>
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
