// Dtos/Matches/MatchListItemDto.cs
public record MatchListItemDto(
    int Id,
    DateTime Date,
    string Location,
    int TeamId,
    string Name,
    string Opponent,
    string Result
);

// Dtos/Matches/MatchDetailDto.cs
public record MatchDetailDto(
    int Id,
    DateTime Date,
    string Location,
    string Name,
    string Opponent,
    string Result,
    bool IsCoachOfTeam   
);

// Dtos/Matches/MatchCreateDto.cs
public class MatchCreateDto
{
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Opponent { get; set; } = string.Empty;
    public string Result { get; set; } = string.Empty; // môže byť "" pre budúci zápas
}

// Dtos/Matches/MatchUpdateDto.cs
public class MatchUpdateDto
{
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Opponent { get; set; } = string.Empty;
    public string Result { get; set; } = string.Empty;
}
