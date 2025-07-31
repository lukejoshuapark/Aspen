using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Aspen.Data.Database;

public class DesignTimeDatabaseContextFactory : IDesignTimeDbContextFactory<DatabaseContext>
{
    public DatabaseContext CreateDbContext(string[] args)
    {
        var configurationBuilder = new ConfigurationBuilder();
        configurationBuilder.AddJsonStream(typeof(DesignTimeDatabaseContextFactory).Assembly.GetManifestResourceStream("Aspen.Data.Database.Aspen.json")!);

        var configuration = configurationBuilder.Build();

        var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();
        optionsBuilder.UseSqlServer(configuration.GetConnectionString("SqlServer"));

        return new DatabaseContext(optionsBuilder.Options);
    }
}
