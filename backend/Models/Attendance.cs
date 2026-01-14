namespace backend.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EventId { get; set; } 
        public string EventType { get; set; } = string.Empty; // "Training" alebo "Match"
        public string Status { get; set; } = string.Empty; 
        public string AbsenceReason { get; set; } = string.Empty; 
    }
}
