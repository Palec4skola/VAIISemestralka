namespace backend.DTO
{
    public record TrainingDto
    (
        DateTime Date,
        string Location,
        int TeamId,
        string Description
    );
}
