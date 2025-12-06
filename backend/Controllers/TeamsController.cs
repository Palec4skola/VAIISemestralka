// Controllers/TeamsController.cs
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using FootballTeam.Data;
using FootballTeam.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeamsController(AppDbContext context)
    {
        _context = context;
    }

    // POST: /teams/create
    [Authorize]
    [HttpPost("create")]
    public async Task<ActionResult<Team>> CreateTeam([FromBody] CreateTeamDto dto)
    {
        // 1. Získame userId z JWT tokenu
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
            return Unauthorized("Missing user id");

        int coachId = int.Parse(userIdClaim);

        // 2. Skontrolujeme že user existuje
        var user = await _context.Users.FindAsync(coachId);
        if (user == null)
            return NotFound("User not found");

        // 3. Vytvoríme tím a nastavíme CoachId z JWT
        var team = new Team
        {
            Name = dto.Name,
            Description = dto.Description,
            CoachId = coachId,
            Country = dto.Country
        };

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        // 4. Po uložení máme team.Id → priraď ho user-ovi
        user.TeamId = team.Id;
        await _context.SaveChangesAsync();

        // 5. Vrátime tím
        return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, team);
    }


    // GET jednotlivý tím – pre CreatedAtAction
    [HttpGet("{id}")]
    public async Task<ActionResult<Team>> GetTeam(int id) =>
        await _context.Teams.FindAsync(id) is Team team ? team : NotFound();

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTeam(int id)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return NotFound();

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}


// DTO
public class CreateTeamDto
{
    [Required] public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Required] public int CoachId { get; set; }
    [Required] public string Country { get; set; } = string.Empty;
}