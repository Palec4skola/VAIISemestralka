namespace backend.Models
{
    public class TeamInviteCode
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty; // napr. "A7K9"
        public int TeamId { get; set; }
        public Team Team { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; } // voliteľné
        public bool IsActive { get; set; } = true;
    }

}
