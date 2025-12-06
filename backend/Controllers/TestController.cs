using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        // GET: /api/test
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "API funguje správne!" });
        }

        // GET: /api/test/hello
        [HttpGet("hello")]
        public IActionResult Hello()
        {
            return Ok("Ahoj z ASP.NET backendu!");
        }
    }
}
