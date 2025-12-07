"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import "@/styles/CalendarPage.css";

type ActivityType = "training" | "match";

type Activity = {
  id: number;
  date: string;      // "2024-12-10"
  time: string;      // "18:00"
  title: string;     // názov/typ
  type: ActivityType;
};

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    date: "2024-12-10",
    time: "18:00",
    title: "Tréning – technika",
    type: "training",
  },
  {
    id: 2,
    date: "2024-12-12",
    time: "19:00",
    title: "Zápas vs FK Mesto",
    type: "match",
  },
  {
    id: 3,
    date: "2024-12-15",
    time: "17:30",
    title: "Tréning – kondičný",
    type: "training",
  },
];

export default function CalendarPage() {
  const [current] = useState(() => new Date(2024, 11, 1)); // december 2024 (mesiace 0-based)

  const year = current.getFullYear();
  const month = current.getMonth(); // 0-11

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7; // 0 = pondelok

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const activitiesByDay = useMemo(() => {
    const map: Record<number, Activity[]> = {};
    for (const a of MOCK_ACTIVITIES) {
      const d = new Date(a.date);
      const day = d.getDate();
      if (!map[day]) map[day] = [];
      map[day].push(a);
    }
    return map;
  }, []);

  const weeks: (number | null)[][] = [];
  let currentDay = 1 - startWeekday;

  while (currentDay <= daysInMonth) {
    const week: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay < 1 || currentDay > daysInMonth) {
        week.push(null);
      } else {
        week.push(currentDay);
      }
      currentDay++;
    }
    weeks.push(week);
  }

  const monthName = current.toLocaleString("sk-SK", { month: "long" });

  return (
    <div className="calendar-layout">
      <Sidebar selected="Kalendár" setSelected={() => {}} />

      <main className="calendar-main">
        <header className="calendar-header">
          <h1 className="calendar-title">
            Kalendár – {monthName} {year}
          </h1>
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
                if (!day) return <div key={di} className="calendar-day empty" />;

                const activities = activitiesByDay[day] ?? [];

                return (
                  <div key={di} className="calendar-day">
                    <div className="calendar-day-number">{day}</div>
                    <div className="calendar-day-activities">
                      {activities.map((a) => (
                        <div
                          key={a.id}
                          className={`calendar-activity ${a.type}`}
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
