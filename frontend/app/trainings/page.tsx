"use client";

import { Alert, Col, Container, Row } from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import TrainingsList from "@/components/trainings/TrainingsList";
import { useTrainings } from "@/hooks/trainings/useTrainings";
import { useRouter } from "next/navigation";
import ListHeader from "@/components/common/ListHeader";
import "@/styles/Training.css";

export default function TrainingsPage() {
  const router = useRouter();
  const { trainings, mode, setMode, error } = useTrainings();

 return (
  <Container fluid className="p-0 trainingsShell">
    <Row className="g-0">
      <Col xs="auto" className="p-0 trainingsSidebar">
        <Sidebar />
      </Col>

      <Col className="ps-3 ps-md-4 py-3 trainingsContent">
        <div className="trainingsHeaderWrap">
          <ListHeader
            title="Tréningy"
            subtitle="Prehľad tréningov v tvojich tímoch"
            mode={mode}
            onModeChange={setMode}
            createLabel="+ Pridať tréning"
            onCreate={() => router.push("/trainings/create")}
          />
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="justify-content-center g-0">
          <Col xs={12} md={10} lg={8}>
            <TrainingsList trainings={trainings} />
          </Col>
        </Row>
      </Col>
    </Row>
  </Container>
);

}
