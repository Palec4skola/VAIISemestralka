"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useTeamDetail } from "@/hooks/useTeamDetail";
import TeamInfoCard from "@/components/teams/TeamInfoCard";
import TeamMembersList from "@/components/teams/TeamMembers";

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { team, error } = useTeamDetail(id);

  if (!team) return null;

  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar selected="Tím" setSelected={() => {}} />
        </Col>

        <Col>
          <h1 className="h3 mb-4">Detail tímu</h1>
          {error && <Alert variant="danger">{error}</Alert>}

          <TeamInfoCard
            team={team}
            onEdit={() => router.push(`/teams/${id}/edit`)}
          />

          <TeamMembersList
            members={team.members ?? []}
            isCoach={team.myRole === "Coach"}
            onInvite={() => {}}
            onKick={() => {}}
          />
        </Col>
      </Row>
    </Container>
  );
}
