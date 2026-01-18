"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { useMatchDetail } from "@/hooks/matches/useMatchDetail";

import DetailHeader from "@/components/common/DetailHeader";
import MatchDetailCard from "@/components/matches/MatchDetailCard";
import EventAttendanceSection from "@/components/attendance/EventAttendanceSection";
import { useDeleteMatch } from "@/hooks/matches/useDeleteMatch";
import { useState } from "react";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const matchId = Number(params.id);

  const { match, loading, error } = useMatchDetail(matchId);
  const isCoach = match?.isCoachOfTeam === true;
  const [showDelete, setShowDelete] = useState(false);
const del = useDeleteMatch();

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col className="ps-3 py-3 ps-md-4">
          <DetailHeader
            title="Detail zápasu"
            subtitle="Informácie o zápase"
            canEdit={!!isCoach}
            onEdit={() => router.push(`/matches/${matchId}/edit`)}
            onDelete={() => setShowDelete(true)}
          />

          {loading && (
            <div className="d-flex align-items-center gap-2 text-muted">
              <Spinner animation="border" size="sm" />
              Načítavam detail…
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && match && (
            <>
              <Row className="justify-content-center g-0">
                <Col xs={12} md={10} lg={8}>
                  <MatchDetailCard match={match} />
                  <EventAttendanceSection
                    eventType="Match"
                    eventId={match.id}
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
          if (!match) return;
          const ok = await del.remove(match.id);
          if (ok) router.push("/matches");
        }}
      />  
    </Container>
    
  );
}
