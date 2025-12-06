using Microsoft.EntityFrameworkCore;
using FootballTeam.Models;

namespace FootballTeam.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Training> Trainings { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
    }
}
