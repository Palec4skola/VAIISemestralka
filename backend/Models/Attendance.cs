namespace backend.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EventId { get; set; } // Can refer to Training or Match
        public string EventType { get; set; } = string.Empty; // "Training" or "Match"
        public string Status { get; set; } = string.Empty; // "Present", "Absent", etc.
        public string AbsenceReason { get; set; } = string.Empty; // Reason for absence if applicable
    }
}
