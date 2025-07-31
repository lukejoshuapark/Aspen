using Aspen.Data.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Aspen.Data.Database;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    public DbSet<Post> Posts { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        Post.Configure(modelBuilder);
        User.Configure(modelBuilder);
    }
}
