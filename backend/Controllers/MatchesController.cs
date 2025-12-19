using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class MatchesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
