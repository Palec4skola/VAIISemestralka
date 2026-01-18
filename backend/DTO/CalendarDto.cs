namespace backend.DTO
{
    public record CalendarItemDto(
    int Id,
    DateTime Date,      
    string Title,
    string Type,        // "training" alebo "match"
    string? Location
);

}
