import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "@/components/Sidebar";

type Props = {
  selected: string;
  onSelect: (item: string) => void;
  children: React.ReactNode;
};

export default function HomeLayout({  children }: Props) {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs="auto" className="p-0">
          <Sidebar />
        </Col>

        <Col className="p-4">{children}</Col>
      </Row>
    </Container>
  );
}
