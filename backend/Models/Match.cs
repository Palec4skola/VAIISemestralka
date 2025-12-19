namespace backend.Models
{
    public class Match
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; } = string.Empty;
        public int TeamId { get; set; }
        public string Opponent { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
    }
}
