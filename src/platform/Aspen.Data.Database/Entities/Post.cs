using Microsoft.EntityFrameworkCore;

namespace Aspen.Data.Database.Entities;

public sealed class Post
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required int Likes { get; set; }

    public required Guid UserId { get; set; }
    public User? User { get; set; }

    public static void Configure(ModelBuilder modelBuilder)
    {
        var configuration = modelBuilder.Entity<Post>();
        configuration.ToTable(nameof(Post), "Aspen");
    }
}
