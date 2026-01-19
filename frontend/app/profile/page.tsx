"use client";

import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { useMyProfile } from "@/hooks/profile/useMyProfile";
import { useUpdateMyProfile } from "@/hooks/profile/useUpdateMyProfile";
import { ProfileForm } from "@/components/profile/ProfileForm";
import Sidebar from "@/components/Sidebar";
export default function ProfilePage() {
  const { profile, setProfile, loading, error: loadError } = useMyProfile();

  const {
    update,
    saving,
    error: saveError,
    success,
  } = useUpdateMyProfile({
    onUpdated: (patch) => {
      setProfile((p) => (p ? { ...p, ...patch } : p));
    },
  });

  if (loading) {
    return (
      <Container className="py-4">
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          Načítavam profil…
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>
        <Col className="ps-3 py-3 ps-md-4">
          <Row className="justify-content-center g-0 ps-3 ps-md-4 py-3">
            <Col xs={12} md={10} lg={8} className="text-center">
              <h1 className="h3 mb-1">Profil</h1>
              <div className="text-muted mb-3">Uprav si svoje údaje</div>

              {loadError && <Alert variant="danger">{loadError}</Alert>}
              {saveError && <Alert variant="danger">{saveError}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {profile && (
                <ProfileForm
                  key={profile.id}
                  email={profile.email}
                  name={profile.name}
                  saving={saving}
                  onSubmit={(name) => update({ name })}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
