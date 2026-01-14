"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useTeamDetail } from "@/hooks/team/useTeamDetail";
import { useInviteCode } from "@/hooks/team/useInviteCode";
import TeamInfoCard from "@/components/teams/TeamInfoCard";
import TeamMembersList from "@/components/teams/TeamMembers";
import InviteCodeModal from "@/components/teams/InviteCodeModal";
import { useKickMember } from "@/hooks/team/useKickMember";

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { team, error, loading, refetch } = useTeamDetail(id);

  const [showInvite, setShowInvite] = useState(false);
  const invite = useInviteCode(id);
  const kickMember = useKickMember(id, refetch);

  const handleKick = async (memberId: number) => {
    const ok = confirm("Naozaj chceš vyhodiť hráča z tímu?");
    if (!ok) return;

    await kickMember.kick(memberId);
  };

  const openInvite = async () => {
    setShowInvite(true);      
    await invite.generate();  
  };

  const closeInvite = () => {
    setShowInvite(false);
    invite.reset();
  };
  

  if (loading) return <Container className="p-4">Načítavam…</Container>;

  if (!team) {
    return (
      <Container className="p-4">
        {error ? <Alert variant="danger">{error}</Alert> : null}
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar selected="Tím" setSelected={() => {}} />
        </Col>

        <Col className="p-4">
          <h1 className="h3 mb-4">Detail tímu</h1>
          {error && <Alert variant="danger">{error}</Alert>}

          <TeamInfoCard
            team={team}
            onEdit={() => router.push(`/teams/${id}/edit`)}
          />

          <TeamMembersList
            members={team.members ?? []}
            isCoach={team.myRole === "Coach"}
            onInvite={openInvite}
            onKick={handleKick}
          />

          <InviteCodeModal
            show={showInvite}
            onClose={closeInvite}
            code={invite.code}
            loading={invite.loading}
            error={invite.error}
            onCopy={() => navigator.clipboard.writeText(invite.code)}
          />
        </Col>
      </Row>
    </Container>
  );
}
