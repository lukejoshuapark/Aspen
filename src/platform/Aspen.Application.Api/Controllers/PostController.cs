using Aspen.Data.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Aspen.Application.Api.Controllers;

[ApiController]
[Route("post")]
public class PostController : ControllerBase
{
    private readonly IDbContextFactory<DatabaseContext> _dbContextFactory;

    public PostController(IDbContextFactory<DatabaseContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    [HttpPost("{userId}")]
    public async Task<IActionResult> ListAsync([FromRoute] Guid userId, [FromBody] object queryOptions)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync();
        var posts = await dbContext.Posts.Where(x => x.UserId == userId).ToListAsync();
        return Ok(posts);
    }
}
