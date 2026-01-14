namespace backend.DTO
{
    public record TrainingListItemDto
    (
        int Id,
        DateTime Date,
        string Location,
        string Description,
        int TeamId,
        string TeamName
        
    );

}
