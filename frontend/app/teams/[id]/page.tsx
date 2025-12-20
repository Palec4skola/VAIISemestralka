"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Modal, Spinner, InputGroup, Form } from "react-bootstrap";
import { Plus, Clipboard, Trash } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  ListGroup,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type Team = {
  id: number;
  name: string;
  description: string;
  country: string;
  coachId: number;
  myRole?: string;
  members?: Member[];
};

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function TeamDetailPage() {
  const params = useParams<{ id: string }>();
  const teamId = params.id;
  const router = useRouter();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [myRole, setMyRole] = useState<string | null>(null);

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");
  const handleEdit = () => {
    if (!team) return;
    router.push(`/teams/${team.id}/edit`);
  };
  const handleDelete = async (userId: number) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await fetch(`${API_URL}/teams/${teamId}/kick/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      setError("Nepodarilo sa odstrániť člena tímu");
    }
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          setError(await response.text());
          return;
        }

        const data: Team = await response.json();
        setTeam(data);
        setMembers(data.members || []);
        setMyRole(data.myRole || null);

      } catch {
        setError("Server nie je dostupný");
      }
    };

    if (teamId) fetchTeam();
  }, [teamId]);
  const openInviteModal = async () => {
    if (!team) return;

    setShowInvite(true);
    setLoadingInvite(true);
    setInviteCode(null);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/teams/${team.id}/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setError(await res.text());
        setLoadingInvite(false);
        return;
      }

      const data = await res.json();
      setInviteCode(data.code);
    } catch {
      setError("Nepodarilo sa načítať pozývací kód");
    } finally {
      setLoadingInvite(false);
    }
  };

  return (
    <>
      <Container fluid className="p-0">
        <Row>
          <Col xs="auto" className="p-0">
            <Sidebar selected="Tím" setSelected={() => {}} />
          </Col>

          <Col>
            <h1 className="h3 mb-4">Detail tímu</h1>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={8}>
                {team && (
                  <Card className="mb-4 shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{team.name}</h5>
                        <div className="text-muted small">
                          {team.description}
                        </div>
                      </div>
{myRole === "Coach" && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleEdit}
                      >
                        <PencilSquare />
                      </Button>
)}
                    </Card.Header>

                    <Card.Body>
                      <Row className="mb-2">
                        <Col md={4} className="fw-semibold">
                          Krajina
                        </Col>
                        <Col md={8}>{team.country}</Col>
                      </Row>

                      <Row>
                        <Col md={4} className="fw-semibold">
                          Tréner
                        </Col>
                        <Col md={8}>{team.coachId}</Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}

                {members.length > 0 && (
                  <Card className="shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <strong>Členovia tímu</strong>
{myRole === "Coach" && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={openInviteModal}
                      >
                        <Plus className="me-1" />
                        Pridať hráča
                      </Button>
)}
                    </Card.Header>

                    <ListGroup variant="flush">
                      {members.map((m) => (
                        <ListGroup.Item key={m.id}>
                          <Row>
                            <Col md={4} className="fw-semibold">
                              {m.name}
                            </Col>
                            <Col md={3}>{m.role}</Col>
                            <Col md={4} className="text-muted small">
                              {m.email}
                            </Col>
                            {myRole === "Coach" && (
                              <Col md={1}>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(m.id)}
                                >
                                  <Trash />
                                </Button>
                              </Col>
                            )}
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Modal show={showInvite} onHide={() => setShowInvite(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pozvať hráča</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loadingInvite && (
            <div className="text-center py-3">
              <Spinner animation="border" />
            </div>
          )}

          {!loadingInvite && inviteCode && (
            <>
              <p className="text-muted">
                Pošli tento kód hráčovi. Kód je platný obmedzený čas.
              </p>

              <InputGroup>
                <Form.Control
                  value={inviteCode}
                  readOnly
                  className="text-center fw-bold"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => navigator.clipboard.writeText(inviteCode)}
                >
                  <Clipboard />
                </Button>
              </InputGroup>
            </>
          )}

          {!loadingInvite && !inviteCode && (
            <Alert variant="danger">Nepodarilo sa získať pozývací kód.</Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvite(false)}>
            Zavrieť
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
