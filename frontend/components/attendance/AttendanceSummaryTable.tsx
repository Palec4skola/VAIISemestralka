"use client";

import { Card, ProgressBar, Table } from "react-bootstrap";
import type { AttendanceSummaryRow } from "@/hooks/attendance/useTrainingAttendanceSummary";

type Props = {
  items: AttendanceSummaryRow[];
};

export default function AttendanceSummaryTable({ items }: Props) {
  return (
    <Card className="attendanceCard shadow-sm">
      <Card.Body className="attendanceBody">
        <Table responsive hover className="attendanceTable mb-0 align-middle">
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
                    <div className="attendanceEmail">{p.email}</div>
                  </td>

                  <td className="text-nowrap attendanceCount">
                    {p.present}/{p.total}
                  </td>

                  <td>
                    <div className="attendanceProgress">
                      <ProgressBar now={percent} />
                      <span className="attendancePercent">{percent}%</span>
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
