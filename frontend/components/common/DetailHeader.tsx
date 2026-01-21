"use client";

import { Button, Stack } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import "@/styles/DetailHeader.css";

type Props = {
  title: string;
  subtitle?: string;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function DetailHeader({
  title,
  subtitle,
  canEdit = false,
  onEdit,
  onDelete,
}: Props) {
  const router = useRouter();

  return (
  <Stack
    direction="horizontal"
    className="detailHeader justify-content-between align-items-start mb-3"
  >
    <div className="detailHeaderText">
      <h1 className="h3 mb-1">{title}</h1>
      {subtitle && <div className="text-muted">{subtitle}</div>}
    </div>

    <Stack direction="horizontal" gap={2} className="detailHeaderActions">
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => router.back()}
      >
        Späť
      </Button>

      {canEdit && (
        <>
          <Button
            variant="outline-warning"
            size="sm"
            title="Upraviť"
            onClick={onEdit}
            className="d-flex align-items-center"
          >
            <PencilSquare size={16} />
          </Button>

          <Button
            variant="outline-danger"
            size="sm"
            title="Zmazať"
            onClick={onDelete}
            className="d-flex align-items-center"
          >
            <Trash size={16} />
          </Button>
        </>
      )}
    </Stack>
  </Stack>
);

}
