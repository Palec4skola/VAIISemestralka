"use client";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Team } from "@/types/team";

type Props = {
  team: Team;
  onSettingsClick?: () => void;
};

export default function TeamInfoPanel({ team, onSettingsClick }: Props) {

  return (
    <Card className="mb-3 shadow-sm" style={{ maxWidth: 360 }}>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #7c4dff, #06b6d4)",
              marginRight: 12,
            }}
          />
          <div>
            <Card.Title className="mb-0">{team.teamName}</Card.Title>
          </div>
        </div>

        <Card.Text className="mb-1">
          {team.description}
        </Card.Text>
        <Card.Text className="text-muted mb-2">
          Krajina: {team.country}
        </Card.Text>
        <Button
          variant="outline-primary"
          className="w-100"
          onClick={onSettingsClick}
        >
          Settings
        </Button>
      </Card.Body>
    </Card>
  );
}
