namespace backend.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CoachId { get; set; }
        public string Country { get; set; } = string.Empty;
        public ICollection<TeamUser> TeamUsers { get; set; } = new List<TeamUser>();
    }
}

