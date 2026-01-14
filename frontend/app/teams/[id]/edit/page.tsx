"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import EditTeamForm from "@/components/teams/EditTeamForm";
import { useEditTeam } from "@/hooks/team/useEditTeam";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";

export default function EditTeamPage() {
  const params = useParams<{ id: string }>();
  const { team, loading, error, success, updateField, submit } =
    useEditTeam(params.id);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar selected="Tím" setSelected={() => {}} />

      <main className="flex-grow-1">
        <header className="bg-light border-bottom p-3">
          <h1 className="h3 mb-0">Upraviť tím</h1>
        </header>

        <Container className="py-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {loading && <Spinner />}

          {team && (
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <EditTeamForm
                  team={team}
                  onChange={updateField}
                  onSubmit={submit}
                />
              </Col>
            </Row>
          )}
        </Container>
      </main>
    </div>
  );
}
