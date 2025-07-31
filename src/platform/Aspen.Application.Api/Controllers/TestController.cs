using Microsoft.AspNetCore.Mvc;

namespace Aspen.Application.Api.Controllers;

[ApiController]
[Route("test")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Test endpoint is working!");
    }
}
