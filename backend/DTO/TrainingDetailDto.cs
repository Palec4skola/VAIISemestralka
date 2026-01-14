namespace backend.DTO
{
    public record TrainingDetailDto
    (
        int Id,
        DateTime Date,
        string Location,
        string Description,
        int TeamId,
        string TeamName,
        string MyRole,
        string? MyAttendanceStatus,
        string? MyAbsenceReason
    );

}
