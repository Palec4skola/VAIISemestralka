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
    public class UsersController : Controller
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            // rovnaký pattern ako používaš inde
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException();

            return userId;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDto>> GetMe()
        {
            var userId = GetUserId();

            var user = await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == userId)
                .Select(u => new UserProfileDto(
                    u.Id,
                    u.Email,
                    u.Name
                ))
                .FirstOrDefaultAsync();

            if (user == null) return NotFound();

            return Ok(user);
        }
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateUserProfileDto dto)
        {
            var userId = GetUserId();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return NotFound();

            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            if (dto.Name.Length > 60)
                return BadRequest("Name is too long.");

            user.Name = dto.Name.Trim();

            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
