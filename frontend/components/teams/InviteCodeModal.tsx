"use client";

import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";

type InviteCodeModalProps = {
  show: boolean;
  onClose: () => void;
  code: string;
  loading: boolean;
  error: string;
  onCopy: () => void;
};

export default function InviteCodeModal({
  show,
  onClose,
  code,
  loading,
  error,
  onCopy,
}: InviteCodeModalProps) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Invite kód</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading && (
          <div className="d-flex align-items-center gap-2">
            <Spinner size="sm" />
            <span>Generujem kód…</span>
          </div>
        )}

        {!loading && error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        {!loading && !error && code && (
          <>
            <Form.Label>Pošli tento kód hráčovi:</Form.Label>
            <Form.Control value={code} readOnly className="mb-2" />
            <Button variant="outline-secondary" onClick={onCopy}>
              Kopírovať
            </Button>
          </>
        )}

        {!loading && !error && !code && (
          <p className="mb-0 text-muted">Kód nie je dostupný.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Zavrieť
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
