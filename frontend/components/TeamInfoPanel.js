import React from "react";
import "../styles/HomePage.css";

export default function TeamInfoPanel({ team }) {
  return (
    <div className="team-info">
      <div className="team-header">
        <div className="team-image"></div>
        <h2>{team.name}</h2>
      </div>
      <div className="team-stats">
        <p>Members: {team.members}</p>
        <p>Followers: {team.followers}</p>
        <p>Team level: {team.level}</p>
        <p>Age group: {team.ageGroup}</p>
        <p>Gender: {team.gender}</p>
        <p>Premium: {team.premium ? "Yes" : "No"}</p>
        <p>Visibility: {team.visible ? "Visible" : "Hidden"}</p>
      </div>
      <button className="team-button">Settings</button>
    </div>
  );
}
