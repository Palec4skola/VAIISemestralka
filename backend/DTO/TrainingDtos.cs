namespace backend.DTO
{
    public record TrainingDtos
    (
        DateTime Date,
        string Location,
        int TeamId,
        string Description
    );
    public record TrainingListItemDto
    (
        int Id,
        DateTime Date,
        string Location,
        string Description,
        int TeamId,
        string Name

    );
    public record TrainingDetailDto
    (
        int Id,
        DateTime Date,
        string Location,
        string Description,
        int TeamId,
        string Name,
        string Role,
        string? MyAttendanceStatus,
        string? MyAbsenceReason
    );
    public record TrainingAttendanceItemDto(
         int AttendanceId,
         int PlayerId,
         string PlayerName,
         string Status,
         string? AbsenceReason
     );
}
