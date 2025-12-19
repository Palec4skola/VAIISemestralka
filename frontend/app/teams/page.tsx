"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ListGroup,
  Card,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import Sidebar from "@/components/Sidebar";
type Team = {
  teamId: number;
  teamName: string;
  description: string;
  country: string;
  coachId: number;
};
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`${API_URL}/teams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          setError(await response.text());
          return;
        }

        const data: Team[] = await response.json();
        setTeams(data);
      } catch (e) {
        setError("Server nie je dostupný");
      }
    };

    fetchTeam();
  }, []);
  const handleDelete = async (id: number) => {
    if (!confirm("Naozaj chceš odstrániť tento tím?")) return;

    try {
      const res = await fetch(`${API_URL}/teams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok && res.status !== 204) {
        setError(await res.text());
        return;
      }

      setTeams((prev) => (prev ? prev.filter((t) => t.teamId !== id) : prev));
    } catch {
      setError("Server nie je dostupný");
    }
  };
  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar selected="Tím" setSelected={() => {}} />
        </Col>

        <Col>
          <h1 className="h3 mb-4">Tímy</h1>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <Card className="shadow-sm">
                <Card.Header>
                  <strong>Zoznam tímov</strong>
                </Card.Header>

                <ListGroup variant="flush">
                  {teams && teams.length > 0 ? (
                    teams.map((team) => (
                      <ListGroup.Item key={team.teamId}>
                        <Row className="align-items-center">
                          <Col
                            role="button"
                            onClick={() => router.push(`/teams/${team.teamId}`)}
                          >
                            <div className="fw-semibold">{team.teamName}</div>
                            <div className="text-muted small">
                              {team.description}
                            </div>
                            <div className="text-muted small">
                              Krajina: {team.country}
                            </div>
                          </Col>

                          <Col xs="auto">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(team.teamId)}
                            >
                              <Trash />
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item key="empty">
                      Žiadne tímy neboli nájdené.
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
