namespace FootballTeam.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; }
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; }
        public int TeamId { get; set; }
    }
}
