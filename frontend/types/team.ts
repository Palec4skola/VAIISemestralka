import { Member } from "./member";

export type Team = {
  teamId: number;
  teamName: string;
  description: string;
  country: string;
  coachId?: number;
  myRole?: string;
  members?: Member[];
};
