import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "@/components/Sidebar";

type Props = {
  selected: string;
  onSelect: (item: string) => void;
  children: React.ReactNode;
};

export default function HomeLayout({ selected, onSelect, children }: Props) {
  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs="auto" className="p-0">
          <Sidebar selected={selected} setSelected={onSelect} />
        </Col>

        <Col className="p-4">{children}</Col>
      </Row>
    </Container>
  );
}
