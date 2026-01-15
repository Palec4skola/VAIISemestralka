using System.Security.Cryptography;
using System.Text;
using backend.DTO;
using FootballTeam.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthDtos request)
        {
            if (string.IsNullOrWhiteSpace(request?.Email) || string.IsNullOrWhiteSpace(request?.Password) || string.IsNullOrWhiteSpace(request?.Name))
                return BadRequest("Name, email and password are required.");

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return BadRequest("User with this email already exists.");
            }

            var hashedPassword = HashPassword(request.Password);

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = hashedPassword,
                Role = "Player"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully", user = new { user.Id, user.Name, user.Email, user.Role } });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Email) || string.IsNullOrWhiteSpace(request?.Password))
                return BadRequest("Email and password are required.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            // Porovnanie hash hesla
            var hash = HashPassword(request.Password);
            if (user.Password != hash)
                return Unauthorized("Invalid email or password.");

            // Create JWT
            var config = HttpContext.RequestServices.GetService(typeof(Microsoft.Extensions.Configuration.IConfiguration)) as Microsoft.Extensions.Configuration.IConfiguration;
            if (config == null) return StatusCode(500, "Configuration not available");

            var key = config.GetValue<string>("Jwt:Key");
            var issuer = config.GetValue<string>("Jwt:Issuer");
            var audience = config.GetValue<string>("Jwt:Audience");
            var durationMinutes = config.GetValue<int>("Jwt:DurationMinutes");

            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, System.Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role ?? "Player")
            };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: System.DateTime.UtcNow.AddMinutes(durationMinutes > 0 ? durationMinutes : 60),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                message = "Login successful",
                token = tokenString,
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role
                }
            });
        }


        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }

    
    
}
