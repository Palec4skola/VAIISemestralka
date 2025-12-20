"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function JoinTeamPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return;

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/teams/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(code),
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage(`Chyba: ${text}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMessage("Úspešne si sa pripojil k tímu! 🎉");
    } catch {
      setMessage("Server nie je dostupný");
    } finally {
      setLoading(false);
      router.push("/home");
    }
  };

  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar selected="Tím" setSelected={() => {}} />
        </Col>

        <Col>
          <Row className="justify-content-center mt-5">
            <Col xs={12} md={6} lg={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="mb-2 text-center">
                    Pripojiť sa k tímu
                  </Card.Title>
                  <Card.Text className="text-muted text-center mb-4">
                    Zadaj 4-miestny kód, ktorý si dostal od trénera
                  </Card.Text>

                  {message && <Alert variant="info">{message}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="join-code">
                      <Form.Label>Kód tímu</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          maxLength={4}
                          placeholder="AB12"
                          value={code}
                          onChange={(e) =>
                            setCode(e.target.value.toUpperCase().trim())
                          }
                        />
                      </InputGroup>
                    </Form.Group>

                    <div className="d-grid">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={code.length < 4 || loading}
                      >
                        {loading ? "Pripájanie..." : "Join Team"}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
