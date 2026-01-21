using System.Security.Claims;
using backend.DTO;
using backend.Models;
using FootballTeam.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class MatchesController : Controller
    {
        private readonly AppDbContext _context;

        public MatchesController(AppDbContext context)
        {
            _context = context;
        }
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("Invalid token.");
            return userId;
        }

        private async Task<bool> IsMemberOfTeam(int userId, int teamId)
        {
            return await _context.TeamUsers.AnyAsync(tu => tu.UserId == userId && tu.TeamId == teamId);
        }

        private async Task<bool> IsCoachOfTeam(int userId, int teamId)
        {
            var isCoachByTeamUser = await _context.TeamUsers.AnyAsync(tu =>
                tu.UserId == userId && tu.TeamId == teamId && tu.Role == "Coach");


            if (isCoachByTeamUser) return true;

            return await _context.Teams.AnyAsync(t => t.Id == teamId && t.CoachId == userId);
        }


        // GET: matches
        // vráti zápasy iba z tímov, v ktorých som člen
        [HttpGet]
        public async Task<ActionResult<List<MatchListItemDto>>> GetAllMyTeamsMatches()
        {
            var userId = GetUserId();

            var items = await (
                from tu in _context.TeamUsers
                join m in _context.Matches on tu.TeamId equals m.TeamId
                join team in _context.Teams on m.TeamId equals team.Id
                where tu.UserId == userId
                orderby m.Date
                select new MatchListItemDto(
                    m.Id, m.Date, m.Location, m.TeamId, team.Name, m.Opponent, m.Result
                )
            ).ToListAsync();

            return Ok(items);
        }

        // GET: matches/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<MatchDetailDto>> GetById(int id)
        {
            var userId = GetUserId();

            var match = await _context.Matches.AsNoTracking().FirstOrDefaultAsync(m => m.Id == id);
            if (match == null) return NotFound();

            var isCoach = await _context.TeamUsers.AnyAsync(tu =>
                tu.TeamId == match.TeamId &&
                tu.UserId == userId &&
                tu.Role == "Coach"
            );
            var isMember = await IsMemberOfTeam(userId, match.TeamId);
            if (!isMember) return Forbid();

            var teamName = await _context.Teams
                .Where(t => t.Id == match.TeamId)
                .Select(t => t.Name)
                .FirstAsync();

            return Ok(new MatchDetailDto(
                match.Id,
                match.Date,
                match.Location,
                teamName,
                match.Opponent,
                match.Result,
                isCoach
            ));
        }

        // GET: matches/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult<List<MatchListItemDto>>> GetUpcoming()
        {
            var userId = GetUserId();

            var fromUtc = DateTime.UtcNow;

            var items = await (
                from tu in _context.TeamUsers
                join m in _context.Matches on tu.TeamId equals m.TeamId
                join team in _context.Teams on m.TeamId equals team.Id
                where tu.UserId == userId && m.Date >= fromUtc
                orderby m.Date
                select new MatchListItemDto(
                    m.Id, m.Date, m.Location, m.TeamId, team.Name, m.Opponent, m.Result
                )
            ).ToListAsync();

            return Ok(items);
        }

        // ---------- WRITE (iba coach) ----------

        // POST: matches/{teamId}
        [HttpPost("{teamId:int}")]
        public async Task<ActionResult<MatchDetailDto>> Create(int teamId,[FromBody] MatchCreateDto dto)
        {
            var userId = GetUserId();

            // musí byť aspoň člen tímu (bezpečnostne), a zároveň coach
            if (!await IsMemberOfTeam(userId, teamId)) return Forbid();
            if (!await IsCoachOfTeam(userId, teamId)) return Forbid();

            var match = new Match
            {
                Date = dto.Date,
                Location = dto.Location?.Trim() ?? "",
                TeamId = teamId,
                Opponent = dto.Opponent?.Trim() ?? "",
                Result = dto.Result?.Trim() ?? ""
            };
            var isCoach = await _context.TeamUsers.AnyAsync(tu =>
                tu.TeamId == match.TeamId &&
                tu.UserId == userId &&
                tu.Role == "Coach"
            );

            _context.Matches.Add(match);
            await _context.SaveChangesAsync();

            var teamName = await _context.Teams
                .Where(t => t.Id == teamId)
                .Select(t => t.Name)
                .FirstAsync();

            return Ok(new MatchDetailDto(
                match.Id,
                match.Date,
                match.Location,
                teamName,
                match.Opponent,
                match.Result,
                isCoach
            ));
        }

        // PUT: matches/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] MatchUpdateDto dto)
        {
            var userId = GetUserId();

            var match = await _context.Matches.FirstOrDefaultAsync(m => m.Id == id);
            if (match == null) return NotFound();

            if (!await IsCoachOfTeam(userId, match.TeamId)) return Forbid();

            match.Date = dto.Date;
            match.Location = dto.Location?.Trim() ?? "";
            match.Opponent = dto.Opponent?.Trim() ?? "";
            match.Result = dto.Result?.Trim() ?? "";

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: matches/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();

            var match = await _context.Matches.FirstOrDefaultAsync(m => m.Id == id);
            if (match == null) return NotFound();

            if (!await IsCoachOfTeam(userId, match.TeamId)) return Forbid();

            _context.Matches.Remove(match);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}