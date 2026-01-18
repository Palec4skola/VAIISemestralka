"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useCalendar } from "@/hooks/calendar/useCalendar";
import { ArrowRight, ArrowLeft } from "react-bootstrap-icons";
import "@/styles/CalendarPage.css";

type ActivityType = "training" | "match";

type Activity = {
  id: number;
  time: string;
  title: string;
  type: ActivityType;
  url: string;
};

function toDayAndTimeLocal(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const time = d.toLocaleTimeString("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { day, time };
}

export default function CalendarPage() {
  const router = useRouter();

  const [current, setCurrent] = useState(() => new Date());

  // ⬇️ TU sa používa useCalendar
  const { items, loading, error } = useCalendar(current);

  const activitiesByDay = useMemo(() => {
    const map: Record<number, Activity[]> = {};

    for (const it of items) {
      const { day, time } = toDayAndTimeLocal(it.date);

      const url =
        it.type === "training" ? `/trainings/${it.id}` : `/matches/${it.id}`;

      const a: Activity = {
        id: it.id,
        time,
        title: it.title,
        type: it.type,
        url,
      };

      if (!map[day]) map[day] = [];
      map[day].push(a);
    }

    return map;
  }, [items]);

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks: (number | null)[][] = [];
  let dayCounter = 1 - startWeekday;

  while (dayCounter <= daysInMonth) {
    const week: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (dayCounter < 1 || dayCounter > daysInMonth) week.push(null);
      else week.push(dayCounter);
      dayCounter++;
    }
    weeks.push(week);
  }

  const monthName = current.toLocaleString("sk-SK", { month: "long" });

  return (
    <div className="calendar-layout">
      <Sidebar />

      <main className="calendar-main">
        <header className="calendar-header">
          <h1 className="calendar-title">
            Kalendár – {monthName} {year}
          </h1>

          <div className="calendar-controls d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setCurrent(new Date(year, month - 1, 1))}
            >
              <ArrowLeft />
            </button>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setCurrent(new Date())}
            >
              Dnes
            </button>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setCurrent(new Date(year, month + 1, 1))}
            >
              <ArrowRight />
            </button>
          </div>

          {loading && <div className="text-muted">Načítavam…</div>}
          {error && <div className="alert alert-danger">{error}</div>}
        </header>

        <section className="calendar-grid">
          <div className="calendar-weekdays">
            {["Po", "Ut", "St", "Št", "Pi", "So", "Ne"].map((d) => (
              <div key={d} className="calendar-weekday">
                {d}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="calendar-week">
              {week.map((day, di) => {
                if (!day)
                  return <div key={di} className="calendar-day empty" />;

                const activities = activitiesByDay[day] ?? [];

                return (
                  <div key={di} className="calendar-day">
                    <div className="calendar-day-number">{day}</div>

                    <div className="calendar-day-activities">
                      {activities.map((a) => (
                        <div
                          key={a.id}
                          className={`calendar-activity ${a.type}`}
                          onClick={() => router.push(a.url)}
                        >
                          <span className="calendar-activity-time">
                            {a.time}
                          </span>
                          <span className="calendar-activity-title">
                            {a.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
