using Microsoft.EntityFrameworkCore;

namespace Aspen.Data.Database.Entities;

public sealed class User
{
    public required Guid Id { get; set; }
    public required string DisplayName { get; set; }

    public required ICollection<Post> Posts { get; set; } = new List<Post>();

    public static void Configure(ModelBuilder modelBuilder)
    {
        var configuration = modelBuilder.Entity<User>();
        configuration.ToTable(nameof(User), "Aspen");
    }
}
