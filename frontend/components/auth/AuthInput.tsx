import { Form } from "react-bootstrap";

type Props = {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

export default function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  error,
}: Props) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        value={value}
        isInvalid={!!error}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
