namespace FootballTeam.Models
{
    public class Training
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; } = string.Empty;
        public int TeamId { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
