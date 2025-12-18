using System.Threading.Tasks;
using System.Security.Claims;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FootballTeam.Data;
using FootballTeam.Models;
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

        // GET: /teams
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();
            if (!int.TryParse(userIdClaim, out var userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            var teams = await _context.Teams
                .Where(t => t.CoachId == userId || t.Id == user.TeamId)
                .ToListAsync();

            return Ok(teams);
        }

        // GET: /teams/all
        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPublic()
        {
            var teams = await _context.Teams.ToListAsync();
            return Ok(teams);
        }

        // GET: /teams/{id}
        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null) return NotFound();
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

            return CreatedAtAction(nameof(Get), new { id = newTeam.Id }, newTeam);
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

    }
}
