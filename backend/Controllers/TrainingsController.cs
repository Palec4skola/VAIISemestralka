using System;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Threading.Tasks;
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
        [HttpPost("{teamId}/create")]
        public async Task<IActionResult> CreateTraining([FromBody] TrainingDto dto, int teamId)
        {
            // Získaj userId z JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // Over, že user je Coach v tíme
            var isCoach = await _context.TeamUsers.AnyAsync(tu =>
                tu.TeamId == teamId &&
                tu.UserId == userId &&
                tu.Role == "Coach");

            if (!isCoach)
                return Forbid("Only coach can generate invite codes.");

            var training = new Training
            {
                Date = dto.Date,
                Location = dto.Location ?? string.Empty,
                TeamId = teamId,
                Description = dto.Description ?? string.Empty
            };

            _context.Trainings.Add(training);
            await _context.SaveChangesAsync();
            return Ok(dto);
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
