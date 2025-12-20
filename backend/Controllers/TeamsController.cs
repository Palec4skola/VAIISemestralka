using System;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FootballTeam.Data;
using backend.Models;
using backend.DTO;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class TeamsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeamsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetTeamDetail(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var team = await _context.Teams
                .Where(t => t.Id == id)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.Country,
                    t.CoachId,

                    // 🔥 rola prihláseného usera v tíme
                    MyRole = t.TeamUsers
                        .Where(tu => tu.UserId == userId)
                        .Select(tu => tu.Role)
                        .FirstOrDefault(),

                    Members = t.TeamUsers.Select(tu => new
                    {
                        tu.User.Id,
                        tu.User.Name,
                        tu.User.Email,
                        tu.Role,
                        tu.JoinedAt
                    })
                })
                .FirstOrDefaultAsync();

            if (team == null)
                return NotFound();

            if (team.MyRole == null)
                return Forbid();

            return Ok(team);
        }

        // POST: /teams/create
        // Create new team — read coach id from authenticated user's JWT and assign it to CoachId.
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] TeamDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Require authenticated user and extract id from JWT claims.
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                              

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var coachId))
            {
                return Unauthorized();
            }

            var newTeam = new Team
            {
                Name = dto.Name ?? string.Empty,
                Description = dto.Description ?? string.Empty,
                Country = dto.Country ?? string.Empty,
                CoachId = coachId
            };

            _context.Teams.Add(newTeam);
            await _context.SaveChangesAsync();

            // Ensure the creator is added as a TeamUser (member) with role 'Coach'
            var teamUser = new TeamUser
            {
                TeamId = newTeam.Id,
                UserId = coachId,
                Role = "Coach",
                JoinedAt = DateTime.UtcNow
            };

            _context.TeamUsers.Add(teamUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTeamDetail), new { id = newTeam.Id }, new
            {
                newTeam.Id,
                newTeam.Name,
                newTeam.Description,
                newTeam.Country,
                newTeam.CoachId
            });
        }

        // PUT: /teams/{id}
        // Update existing team 
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] TeamDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var team = await _context.Teams.FindAsync(id);
            if (team == null) return NotFound();

            team.Name = dto.Name ?? team.Name;
            team.Description = dto.Description ?? team.Description;
            team.Country = dto.Country ?? team.Country;
            team.CoachId = dto.CoachId;

            _context.Teams.Update(team);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: /teams/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null) return NotFound();

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost("{teamId}/invite")]
        public async Task<IActionResult> GenerateInviteCode(int teamId)
        {
            // 1️⃣ Získaj userId z JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // 2️⃣ Over, že user je Coach v tíme
            var isCoach = await _context.TeamUsers.AnyAsync(tu =>
                tu.TeamId == teamId &&
                tu.UserId == userId &&
                tu.Role == "Coach");

            if (!isCoach)
                return Forbid("Only coach can generate invite codes.");

            // 3️⃣ Vygeneruj 4-miestny kód
            var code = GenerateInviteCode();

            // 4️⃣ Ulož kód s expiráciou 15 minút
            var invite = new TeamInviteCode
            {
                Code = code,
                TeamId = teamId,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsActive = true
            };

            _context.TeamInviteCodes.Add(invite);
            await _context.SaveChangesAsync();

            // 5️⃣ Vráť kód
            return Ok(new
            {
                code = invite.Code,
                expiresAt = invite.ExpiresAt
            });
        }
        private static string GenerateInviteCode()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            var random = new Random();

            return new string(
                Enumerable.Range(0, 4)
                    .Select(_ => chars[random.Next(chars.Length)])
                    .ToArray()
            );
        }

        [Authorize]
        [HttpPost("join")]
        public async Task<IActionResult> JoinTeamByCode([FromBody] string code)
        {
            // 1️⃣ Získaj userId z JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // 2️⃣ Normalizuj kód (istota)
            code = code.Trim().ToUpper();

            // 3️⃣ Nájde aktívny kód
            var invite = await _context.TeamInviteCodes
                .FirstOrDefaultAsync(c =>
                    c.Code == code &&
                    c.IsActive);

            if (invite == null)
                return BadRequest("Invalid or inactive invite code.");

            // 4️⃣ Skontroluj expiráciu
            if (invite.ExpiresAt != null && invite.ExpiresAt < DateTime.UtcNow)
                return BadRequest("Invite code has expired.");

            // 5️⃣ Skontroluj, či user už nie je v tíme
            var alreadyMember = await _context.TeamUsers.AnyAsync(tu =>
                tu.TeamId == invite.TeamId &&
                tu.UserId == userId);

            if (alreadyMember)
                return BadRequest("You are already a member of this team.");

            // 6️⃣ Pridaj usera do tímu
            var teamUser = new TeamUser
            {
                TeamId = invite.TeamId,
                UserId = userId,
                Role = "Player",
                JoinedAt = DateTime.UtcNow
            };

            _context.TeamUsers.Add(teamUser);

            // 7️⃣ Deaktivuj kód
            invite.IsActive = false;

            await _context.SaveChangesAsync();

            // 8️⃣ Response
            return Ok(new
            {
                message = "Successfully joined the team.",
                teamId = invite.TeamId
            });
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMyTeams()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var teams = await _context.TeamUsers
                .Where(tu => tu.UserId == userId)
                .Select(tu => new
                {
                    TeamId = tu.Team.Id,
                    TeamName = tu.Team.Name,
                    Description = tu.Team.Description,
                    Country = tu.Team.Country,
                    Role = tu.Role,
                    JoinedAt = tu.JoinedAt
                })
                .ToListAsync();

            return Ok(teams);
        }

        [Authorize]
        [HttpPost("{teamId}/leave")]
        public async Task<IActionResult> LeaveTeam(int teamId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // nájdi členstvo
            var membership = await _context.TeamUsers
                .FirstOrDefaultAsync(tu =>
                    tu.TeamId == teamId &&
                    tu.UserId == userId);

            if (membership == null)
                return NotFound("User is not a member of this team.");

            // ak je coach, skontroluj či nie je jediný
            if (membership.Role == "Coach")
            {
                var coachCount = await _context.TeamUsers
                    .CountAsync(tu =>
                        tu.TeamId == teamId &&
                        tu.Role == "Coach");

                if (coachCount <= 1)
                    return BadRequest("Cannot leave team as the only coach.");
            }

            _context.TeamUsers.Remove(membership);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully left the team." });
        }
        [Authorize]
        [HttpPost("{teamId}/kick/{userId}")]
        public async Task<IActionResult> KickPlayer(int teamId, int userId)
        {
            var callerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(callerIdClaim, out var callerId))
                return Unauthorized();

            // 1. over, že volajúci je coach v tíme
            var isCoach = await _context.TeamUsers.AnyAsync(tu =>
                tu.TeamId == teamId &&
                tu.UserId == callerId &&
                tu.Role == "Coach");

            if (!isCoach)
                return Forbid("Only coach can kick players.");

            // 2. coach nemôže kicknúť sám seba
            if (callerId == userId)
                return BadRequest("You cannot kick yourself.");

            // 3. nájdi cieľového usera v tíme
            var targetMembership = await _context.TeamUsers
                .FirstOrDefaultAsync(tu =>
                    tu.TeamId == teamId &&
                    tu.UserId == userId);

            if (targetMembership == null)
                return NotFound("User is not a member of this team.");

            // 4. zakáž kick iného coacha
            if (targetMembership.Role == "Coach")
                return BadRequest("You cannot kick another coach.");

            _context.TeamUsers.Remove(targetMembership);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Player kicked from team." });
        }

    }
}
