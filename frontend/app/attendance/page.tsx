"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useTeams } from "@/hooks/team/useTeams";
import { useTrainingAttendanceSummary } from "@/hooks/attendance/useTrainingAttendanceSummary";

import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import TeamSelectCard from "@/components/teams/TeamSelectCard";
import AttendanceSummaryTable from "@/components/attendance/AttendanceSummaryTable";
import "@/styles/Attendance.css";

export default function AttendancePage() {
  const { teams, error: teamsError } = useTeams();

  // držíme len user selection, nie "auto"
  const [selectedTeamId, setSelectedTeamId] = useState(0);

  // effectiveTeamId (bez useEffect -> bez warningu)
  const teamId =
    selectedTeamId > 0
      ? selectedTeamId
      : teams.length === 1
        ? teams[0].teamId
        : 0;

  const {
    items,
    loading: attendanceLoading,
    error: attendanceError,
  } = useTrainingAttendanceSummary(teamId);

  return (
  <Container fluid className="p-0 appShell">
    <Row className="g-0">
      <Col xs="auto" className="p-0 appSidebar">
        <Sidebar />
      </Col>

      <Col className="ps-3 py-3 ps-md-4 appContent">
        <Row className="justify-content-center g-0">
          <Col xs={12} md={10} lg={8} className="text-center pageHeader">
            <h1 className="h3 mb-1">Dochádzka tímu</h1>
            <div className="text-muted mb-3">
              Prehľad dochádzky na tréningoch
            </div>

            <div className="teamSelectWrap">
              <TeamSelectCard
                teams={teams}
                value={teamId}
                error={teamsError}
                onChange={setSelectedTeamId}
              />
            </div>
          </Col>
        </Row>

        {attendanceLoading && (
          <div>
            <Spinner animation="border" size="sm" />
            <span>Načítavam dochádzku…</span>
          </div>
        )}

        {attendanceError && <Alert variant="danger">{attendanceError}</Alert>}

        {!attendanceLoading && teamId > 0 && items.length > 0 && (
          <Row className="justify-content-center g-0">
            <Col xs={12} md={10} lg={8}>
              <AttendanceSummaryTable items={items} />
            </Col>
          </Row>
        )}

        {!attendanceLoading && teamId > 0 && items.length === 0 && !attendanceError && (
          <div className="emptyState">
            Tento tím zatiaľ nemá žiadne minulé tréningy.
          </div>
        )}
      </Col>
    </Row>
  </Container>
);

}
