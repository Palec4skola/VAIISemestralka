import { Row, Col } from "react-bootstrap";

type Props = {
  title: string;
  actions: React.ReactNode;
};

export default function HomeHeader({ title, actions }: Props) {
  return (
    <Row className="align-items-center mb-4">
      <Col>
        <h1 className="h3 mb-0">{title}</h1>
      </Col>
      <Col xs="auto">{actions}</Col>
    </Row>
  );
}
