"use client";

import { Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  title?: string;
  body?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({
  show,
  title = "Zmazať",
  body = "Naozaj chceš zmazať túto položku? Táto akcia sa nedá vrátiť späť.",
  confirmText = "Zmazať",
  cancelText = "Zrušiť",
  loading = false,
  error = "",
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal show={show} onHide={loading ? undefined : onClose} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>{body}</div>
        {error && <div className="text-danger mt-3">{error}</div>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Mažem..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
