using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FootballTeam.Data;
using FootballTeam.Models;
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
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trainings = await _context.Trainings.ToListAsync();
            return Ok(trainings);
        }

        // GET: /api/trainings/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var training = await _context.Trainings.FindAsync(id);
            if (training == null) return NotFound();
            return Ok(training);
        }

        // POST: /api/trainings
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TrainingDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var training = new Training
            {
                Date = dto.Date,
                Location = dto.Location ?? string.Empty,
                TeamId = 1,
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
