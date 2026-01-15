using System.Security.Claims;
using backend.DTO;
using backend.Models;
using FootballTeam.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FootballTeam.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AttendancesController : Controller
    {
        private readonly AppDbContext _context;
        public AttendancesController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("Invalid token (missing user id).");
            return userId;
        }
        private static string NormalizeEventType(string eventType)
        => eventType.Trim();
        private async Task<int?> GetTeamIdForEvent(string eventType, int eventId)
        {
            eventType = NormalizeEventType(eventType);

            if (eventType == "Training")
            {
                return await _context.Trainings
                    .Where(t => t.Id == eventId)
                    .Select(t => (int?)t.TeamId)
                    .FirstOrDefaultAsync();
            }

            if (eventType == "Match")
            {
                return await _context.Matches
                    .Where(m => m.Id == eventId)
                    .Select(m => (int?)m.TeamId)
                    .FirstOrDefaultAsync();
            }

            return null;
        }
        private async Task<bool> IsMember(int teamId, int userId)
        => await _context.TeamUsers.AnyAsync(tu => tu.TeamId == teamId && tu.UserId == userId);

        private async Task<bool> IsCoach(int teamId, int userId)
            => await _context.TeamUsers.AnyAsync(tu => tu.TeamId == teamId && tu.UserId == userId && tu.Role == "Coach");

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] AddAttendanceDto dto)
        {
            var callerId = GetUserId();
            var eventType = NormalizeEventType(dto.EventType);

            var teamId = await GetTeamIdForEvent(eventType, dto.EventId);
            if (teamId == null)
                return NotFound("Event neexistuje.");

            // kto je target user?
            var targetUserId = dto.UserId ?? callerId;

            // oprávnenia:
            // - player môže upravovať len seba
            // - coach môže upravovať kohokoľvek v tíme
            if (targetUserId != callerId)
            {
                var coach = await IsCoach(teamId.Value, callerId);
                if (!coach) return Forbid();
            }

            // obaja (caller aj target) musia byť členovia tímu
            var callerMember = await IsMember(teamId.Value, callerId);
            if (!callerMember) return Forbid();

            var targetMember = await IsMember(teamId.Value, targetUserId);
            if (!targetMember) return BadRequest("Používateľ nie je členom tímu.");

            // upsert
            var existing = await _context.Attendances.FirstOrDefaultAsync(a =>
                a.UserId == targetUserId &&
                a.EventType == eventType &&
                a.EventId == dto.EventId);

            if (existing == null)
            {
                existing = new Attendance
                {
                    UserId = targetUserId,
                    EventType = eventType,
                    EventId = dto.EventId
                };
                _context.Attendances.Add(existing);
            }

            existing.Status = dto.Status;
            existing.AbsenceReason = dto.Status == "Absent" ? (dto.AbsenceReason ?? "") : "";

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 2) GET: zoznam dochádzky pre event (pre všetkých členov tímu)
        // GET /api/attendance?eventType=Training&eventId=123
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<AttendanceItemDto>>> GetForEvent([FromQuery] string eventType, [FromQuery] int eventId)
        {
            var userId = GetUserId();
            eventType = NormalizeEventType(eventType);

            var teamId = await GetTeamIdForEvent(eventType, eventId);
            if (teamId == null) return NotFound("Event neexistuje.");

            // musí byť člen tímu
            if (!await IsMember(teamId.Value, userId)) return Forbid();

            // všetci členovia tímu + ich attendance (left join)
            var members = await (
                from tu in _context.TeamUsers
                join u in _context.Users on tu.UserId equals u.Id
                where tu.TeamId == teamId.Value
                select new { u.Id, u.Name, u.Email }
            ).ToListAsync();

            var attendances = await _context.Attendances
                .Where(a => a.EventType == eventType && a.EventId == eventId)
                .ToListAsync();

            var byUserId = attendances.ToDictionary(a => a.UserId);

            var result = members.Select(m =>
            {
                byUserId.TryGetValue(m.Id, out var a);
                return new AttendanceItemDto(
                    m.Id,
                    m.Name,
                    m.Email,
                    a?.Status,
                    a?.AbsenceReason
                );
            })
            .OrderBy(x => x.Name)
            .ToList();

            return Ok(result);
        }

        // 3) GET: moja dochádzka pre event (detail)
        // GET /api/attendance/me?eventType=Training&eventId=123
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<MyAttendanceDto>> GetMy([FromQuery] string eventType, [FromQuery] int eventId)
        {
            var userId = GetUserId();
            eventType = NormalizeEventType(eventType);

            var teamId = await GetTeamIdForEvent(eventType, eventId);
            if (teamId == null) return NotFound("Event neexistuje.");

            if (!await IsMember(teamId.Value, userId)) return Forbid();

            var a = await _context.Attendances.FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.EventType == eventType &&
                x.EventId == eventId);

            return Ok(new MyAttendanceDto(a?.Status, a?.AbsenceReason));
        }
    }
}
