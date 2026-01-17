export type MatchListItemDto = {
  id: number;
  date: string;      // ISO
  location: string;
  teamId: number;
  name: string;
  opponent: string;
  result: string;    // "" alebo "2:1"
};

export type MatchesMode = "all" | "upcoming";

export type MatchDetailDto = {
  id: number;
  date: string;
  location: string;
  name: string;
  opponent: string;
  result: string;
  isCoachOfTeam: boolean;
};
export type MatchUpdateDto = {
  date: string;
  location: string;
  opponent: string;
  result: string;
};

