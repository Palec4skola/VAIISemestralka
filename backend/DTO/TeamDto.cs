namespace backend.DTO
{
    public record TeamDto
    (
        int Id,
        string Name,
        string Description,
        string Country,
        int CoachId
    );
}
