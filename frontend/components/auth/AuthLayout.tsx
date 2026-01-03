import { Card, Container } from "react-bootstrap";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, children }: Props) {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-sm" style={{ width: 400 }}>
        <Card.Body>
          <h4 className="mb-4 text-center">{title}</h4>
          {children}
        </Card.Body>
      </Card>
    </Container>
  );
}
