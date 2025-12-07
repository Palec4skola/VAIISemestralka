import React from "react";
import "../styles/Overview.css";

export default function Overview({ matches, attendance }) {
  return (
    <div className="overview">
      <div className="matches">
        <h3>Match Performance</h3>
        {matches.length === 0 ? (
          <div className="empty-state">
            <p>No matches yet...</p>
            <button>Create Match</button>
          </div>
        ) : (
          <ul>
            {matches.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="attendance">
        <h3>Training Attendance</h3>
        <p>0% Attendance</p>
        <p>0/0 Participants</p>
        <p>Attendance Trend: 0%</p>
        <p>No data available</p>
      </div>
    </div>
  );
}
