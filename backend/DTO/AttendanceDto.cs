namespace backend.DTO
{
    public record AttendanceDto(
        int Id,
        int PlayerId,
        int TrainingId,
        string Status,
        string? AbsenceReason
    );
    public record AddAttendanceDto(
    string EventType,   // "Training" | "Match"
    int EventId,
    string Status,      // "Present" | "Absent"
    string? AbsenceReason,
    int? UserId         
);

    public record AttendanceItemDto(
        int UserId,
        string Name,
        string Email,
        string? Status,
        string? AbsenceReason
    );

    public record MyAttendanceDto(
        string? Status,
        string? AbsenceReason
    );
    public record TeamAttendanceSummaryRowDto(
    int UserId,
    string Name,
    string Email,
    int Present,
    int Total
);



}
