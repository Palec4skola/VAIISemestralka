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
    public class TrainingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrainingsController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("upcoming")]
        public async Task<ActionResult<List<TrainingListItemDto>>> GetUpcoming() {
            var userId = GetUserId();
            var fromUtc = DateTime.UtcNow;

            var items = await (
                from tu in _context.TeamUsers
                join t in _context.Trainings on tu.TeamId equals t.TeamId
                join team in _context.Teams on t.TeamId equals team.Id
                where tu.UserId == userId && t.Date >= fromUtc
                orderby t.Date
                select new TrainingListItemDto(
                    t.Id, t.Date, t.Location, t.Description, t.TeamId, team.Name
                )
            ).ToListAsync();
                       
            return Ok(items);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<TrainingListItemDto>>> GetTrainings()
        {
            var userId = GetUserId();

            var items = await (
                from tu in _context.TeamUsers
                join m in _context.Trainings on tu.TeamId equals m.TeamId
                join team in _context.Teams on m.TeamId equals team.Id
                where tu.UserId == userId
                orderby m.Date
                select new TrainingListItemDto(
                    m.Id, m.Date, m.Location,m.Description, m.TeamId, team.Name
                )
            ).ToListAsync();

            return Ok(items);
        }

        [Authorize]
        [HttpPost("{teamId:int}")]
        public async Task<IActionResult> CreateTraining(int teamId, [FromBody] Training dto)
        {
            var userId = GetUserId();

            // over coach rolu v TeamUser
            var isCoach = await _context.TeamUsers.AnyAsync(x =>
                x.TeamId == teamId && x.UserId == userId && x.Role == "Coach");

            if (!isCoach) return Forbid();

            var training = new Training
            {
                TeamId = teamId,
                Date = EnsureUtc(dto.Date),
                Location = dto.Location,
                Description = dto.Description
            };

            _context.Trainings.Add(training);
            await _context.SaveChangesAsync();

            return Ok(training.Id);
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateTraining(int id, [FromBody] Training dto)
        {
            var userId = GetUserId();

            var training = await _context.Trainings.FirstOrDefaultAsync(t => t.Id == id);
            if (training == null) return NotFound();

            var isCoach = await _context.TeamUsers.AnyAsync(x =>
                x.TeamId == training.TeamId && x.UserId == userId && x.Role == "Coach");
            if (!isCoach) return Forbid();

            training.Date = EnsureUtc(dto.Date);
            training.Location = dto.Location;
            training.Description = dto.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTraining(int id)
        {
            var userId = GetUserId();

            var training = await _context.Trainings.FirstOrDefaultAsync(t => t.Id == id);
            if (training == null) return NotFound();

            var isCoach = await _context.TeamUsers.AnyAsync(x =>
                x.TeamId == training.TeamId && x.UserId == userId && x.Role == "Coach");
            if (!isCoach) return Forbid();

            _context.Trainings.Remove(training);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [Authorize]
        [HttpGet("{id:int}/detail")]
        public async Task<ActionResult<TrainingDetailDto>> GetTrainingDetail(int id)
        {
            var userId = GetUserId();

            // nájdi tréning + over členstvo v tíme + zisti teamName a rolu
            var data = await (
                from t in _context.Trainings
                join team in _context.Teams on t.TeamId equals team.Id
                join tu in _context.TeamUsers on team.Id equals tu.TeamId
                where t.Id == id && tu.UserId == userId
                select new
                {
                    Training = t,
                    Name = team.Name,
                    Role = tu.Role
                }
            ).FirstOrDefaultAsync();

            if (data == null)
                return NotFound(); // alebo Forbid(), ale NotFound je OK

            // moja dochádzka na tento tréning
            var myAttendance = await _context.Attendances
                .Where(a =>
                    a.UserId == userId &&
                    a.EventType == "Training" &&
                    a.EventId == id)
                .Select(a => new { a.Status, a.AbsenceReason })
                .FirstOrDefaultAsync();

            return Ok(new TrainingDetailDto(
                data.Training.Id,
                data.Training.Date,
                data.Training.Location,
                data.Training.Description,
                data.Training.TeamId,
                data.Name,
                data.Role,
                myAttendance?.Status,
                myAttendance?.AbsenceReason
            ));
        }


        private DateTime EnsureUtc(DateTime dt)
        {
            return dt.Kind switch
            {
                DateTimeKind.Utc => dt,
                DateTimeKind.Local => dt.ToUniversalTime(),
                DateTimeKind.Unspecified => DateTime.SpecifyKind(dt, DateTimeKind.Utc), // pozri poznámku nižšie
                _ => DateTime.SpecifyKind(dt, DateTimeKind.Utc)
            };
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
