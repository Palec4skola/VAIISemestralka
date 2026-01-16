export type MatchListItemDto = {
  id: number;
  date: string;      // ISO
  location: string;
  teamId: number;
  teamName: string;
  opponent: string;
  result: string;    // "" alebo "2:1"
};

export type MatchesMode = "all" | "upcoming";
