"use client";

import { Container } from "react-bootstrap";
import CreateTeamForm from "@/components/teams/CreateTeamForm";
import { useCreateTeam } from "@/hooks/team/useCreateTeam";

const COUNTRIES = [
  "Slovensko",
  "Česko",
  "Poľsko",
  "Maďarsko",
  "Rakúsko",
  "Nemecko",
  "Taliansko",
  "Francúzsko",
  "Španielsko",
  "Anglicko",
];

export default function CreatePage() {
  const { form, updateField, submit, error, loading } = useCreateTeam();

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <CreateTeamForm
        form={form}
        countries={COUNTRIES}
        error={error}
        loading={loading}
        onChange={updateField}
        onSubmit={submit}
      />
    </Container>
  );
}
