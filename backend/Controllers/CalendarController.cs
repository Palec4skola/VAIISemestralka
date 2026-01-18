using System.Security.Claims;
using backend.DTO;
using FootballTeam.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class CalendarController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CalendarController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<CalendarItemDto>>> Get([FromQuery] DateTime fromUtc, [FromQuery] DateTime toUtc)
        {
            var userId = GetUserId();

            var trainings = await (
                from tu in _context.TeamUsers
                join t in _context.Trainings on tu.TeamId equals t.TeamId
                where tu.UserId == userId && t.Date >= fromUtc && t.Date < toUtc
                select new CalendarItemDto(
                    t.Id,
                    t.Date,
                    string.IsNullOrWhiteSpace(t.Description) ? "Tréning" : $"Tréning – {t.Description}",
                    "training",
                    t.Location
                )
            ).ToListAsync();

            var matches = await (
                from tu in _context.TeamUsers
                join m in _context.Matches on tu.TeamId equals m.TeamId
                where tu.UserId == userId && m.Date >= fromUtc && m.Date < toUtc
                select new CalendarItemDto(
                    m.Id,
                    m.Date,
                    $"Zápas vs {m.Opponent}",
                    "match",
                    m.Location
                )
            ).ToListAsync();

            var items = trainings
                .Concat(matches)
                .OrderBy(x => x.Date)
                .ToList();

            return Ok(items);
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("Invalid token (missing user id).");
            return userId;
        }
    }
}
