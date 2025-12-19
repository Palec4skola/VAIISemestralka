using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FootballTeam.Data;
using backend.Models;
using backend.DTO;

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

        // GET: /api/trainings
        //[HttpGet]
        //public async Task<IActionResult> GetAll()
        //{
        //    var trainings = await _context.Trainings.ToListAsync();
        //    return Ok(trainings);
        //}

        // GET: /api/trainings/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var training = await _context.Trainings.FindAsync(id);
            if (training == null) return NotFound();
            return Ok(training);
        }

        // GET: /api/trainings/mine
        // Returns upcoming trainings for teams the authenticated user belongs to or coaches
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetMyUpcoming()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // teams where user is a member
            var memberTeamIds = await _context.TeamUsers
                .Where(tu => tu.UserId == userId)
                .Select(tu => tu.TeamId)
                .Distinct()
                .ToListAsync();

            // teams where user is coach
            var coachTeamIds = await _context.Teams
                .Where(t => t.CoachId == userId)
                .Select(t => t.Id)
                .ToListAsync();

            var teamIds = memberTeamIds.Union(coachTeamIds).Distinct().ToList();

            if (!teamIds.Any())
                return Ok(Array.Empty<Training>());

            var now = DateTime.UtcNow;
            var trainings = await _context.Trainings
                .Where(tr => teamIds.Contains(tr.TeamId) && tr.Date >= now)
                .OrderBy(tr => tr.Date)
                .ToListAsync();

            return Ok(trainings);
        }

        // POST: /api/trainings
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] TrainingDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // find team where this user is coach
            var team = await _context.Teams.FirstOrDefaultAsync(t => t.CoachId == userId);
            if (team == null) return BadRequest("Authenticated user is not a coach of any team.");

            var training = new Training
            {
                Date = dto.Date,
                Location = dto.Location ?? string.Empty,
                TeamId = team.Id,
                Description = dto.Description ?? string.Empty
            };

            _context.Trainings.Add(training);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = training.Id }, training);
        }

        // PUT: /api/trainings/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] TrainingDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var training = await _context.Trainings.FindAsync(id);
            if (training == null) return NotFound();

            training.Date = dto.Date;
            training.Location = dto.Location ?? string.Empty;
            training.TeamId = dto.TeamId;
            training.Description = dto.Description ?? string.Empty;

            _context.Trainings.Update(training);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: /api/trainings/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var training = await _context.Trainings.FindAsync(id);
            if (training == null) return NotFound();

            _context.Trainings.Remove(training);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
