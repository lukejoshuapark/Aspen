using Aspen.Application.Api.Cors;
using Aspen.Data.ClientQueries;
using Aspen.Data.Database;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Aspen.Application.Api.Controllers;

[ApiController]
[Route("post")]
[EnableCors(CorsPolicies.AllowAll)]
public class PostController : ControllerBase
{
    private readonly IDbContextFactory<DatabaseContext> _dbContextFactory;

    public PostController(IDbContextFactory<DatabaseContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    [HttpPost("{userId}")]
    public async Task<IActionResult> ListAsync([FromRoute] Guid userId, [FromBody] ClientQueryOptions queryOptions)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync();
        var posts = await dbContext.Posts
            .Where(x => x.UserId == userId)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Description,
                x.Likes,
                x.Published
            })
            .WithClientQuery(queryOptions)
            .ToListAsync();

        return Ok(posts);
    }
}
