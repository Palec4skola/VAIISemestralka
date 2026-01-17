"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import EditMatchForm from "@/components/matches/MatchEditForm";
import { useEditMatch } from "@/hooks/matches/useEditMatch";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";

export default function EditMatchPage() {
  const params = useParams<{ id: string }>();
  const { match, form, loading, saving, error, success, updateField, submit } =
    useEditMatch(params.id);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />

      <main className="flex-grow-1">
        <header className="bg-light border-bottom p-3">
          <h1 className="h3 mb-0">Upraviť zápas</h1>
          {match && (
            <div className="text-muted small mt-1">
              {match.name} · vs {match.opponent}
            </div>
          )}
        </header>

        <Container className="py-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {loading && <Spinner />}

          {form && (
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <EditMatchForm
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
