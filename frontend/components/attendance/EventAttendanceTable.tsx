"use client";

import { useState } from "react";
import { Alert, Button, Form, Table } from "react-bootstrap";
import { AttendanceItem, AttendanceStatus } from "@/types/attendance";

type Props = {
  items: AttendanceItem[];
  isCoach: boolean;
  myUserId: number | null;
  saving?: boolean;
  error?: string;
  onSave: (userId: number, status: AttendanceStatus, reason?: string) => Promise<void>;
};

export default function EventAttendanceTable({
  items,
  isCoach,
  myUserId,
  saving = false,
  error = "",
  onSave,
}: Props) {
  const [draft, setDraft] = useState<Record<number, { status: AttendanceStatus; reason: string }>>({});

  const canEdit = (userId: number) => isCoach || (myUserId != null && myUserId === userId);

  const getDraft = (it: AttendanceItem) => {
    const d = draft[it.userId];
    return {
      status: d?.status ?? (it.status ?? "Present"),
      reason: d?.reason ?? (it.absenceReason ?? ""),
    };
  };

  const setRow = (userId: number, patch: Partial<{ status: AttendanceStatus; reason: string }>, cur: { status: AttendanceStatus; reason: string }) => {
    setDraft((prev) => ({
      ...prev,
      [userId]: { status: patch.status ?? cur.status, reason: patch.reason ?? cur.reason },
    }));
  };

  const handleSave = async (it: AttendanceItem) => {
    const { status, reason } = getDraft(it);

    if (status === "Absent" && !reason.trim()) {
      alert("Keď označíš neprítomnosť, musíš napísať dôvod.");
      return;
    }

    await onSave(it.userId, status, reason.trim());
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive className="align-middle">
        <thead>
          <tr>
            <th>Meno</th>
            <th style={{ width: 220 }}>Status</th>
            <th>Dôvod</th>
            <th style={{ width: 140 }} />
          </tr>
        </thead>
        <tbody>
          {items.map((it) => {
            const editable = canEdit(it.userId);
            const d = getDraft(it);

            return (
              <tr key={it.userId}>
                <td>
                  <div className="fw-semibold">{it.name}</div>
                  <div className="text-muted small">{it.email}</div>
                </td>

                <td>
                  {editable ? (
                    <Form.Select
                      value={d.status}
                      onChange={(e) => setRow(it.userId, { status: e.target.value as AttendanceStatus }, d)}
                    >
                      <option value="Present">Prídem</option>
                      <option value="Absent">Neprídem</option>
                    </Form.Select>
                  ) : (
                    <span className="text-muted">{it.status ?? "—"}</span>
                  )}
                </td>

                <td>
                  {editable ? (
                    <Form.Control
                      value={d.reason}
                      onChange={(e) => setRow(it.userId, { reason: e.target.value }, d)}
                      placeholder={d.status === "Absent" ? "Prečo?" : "—"}
                      disabled={d.status !== "Absent"}
                    />
                  ) : (
                    <span className="text-muted">{it.absenceReason ?? "—"}</span>
                  )}
                </td>

                <td className="text-end">
                  {editable && (
                    <Button variant="outline-primary" size="sm" onClick={() => handleSave(it)} disabled={saving}>
                      Uložiť
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
