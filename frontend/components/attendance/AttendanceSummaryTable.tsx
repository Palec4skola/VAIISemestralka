"use client";

import { Card, ProgressBar, Table } from "react-bootstrap";
import type { AttendanceSummaryRow } from "@/hooks/attendance/useTrainingAttendanceSummary";

type Props = {
  items: AttendanceSummaryRow[];
};

export default function AttendanceSummaryTable({ items }: Props) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th>Meno</th>
              <th className="text-nowrap">Tréningy</th>
              <th style={{ width: 220 }}>%</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => {
              const percent =
                p.total > 0 ? Math.round((p.present / p.total) * 100) : 0;

              return (
                <tr key={p.userId}>
                  <td>
                    <div className="fw-semibold">{p.name}</div>
                    <div className="text-muted small">{p.email}</div>
                  </td>

                  <td className="text-nowrap">
                    {p.present}/{p.total}
                  </td>

                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <ProgressBar now={percent} style={{ flex: 1 }} />
                      <span className="text-muted small">{percent}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
