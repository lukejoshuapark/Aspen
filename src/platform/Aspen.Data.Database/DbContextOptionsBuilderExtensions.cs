using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Aspen.Data.Database;

public static class DbContextOptionsBuilderExtensions
{
    public static DbContextOptionsBuilder UseAspenSqlServer(this DbContextOptionsBuilder builder, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("SqlServer");
        if (string.IsNullOrEmpty(connectionString))
            throw new InvalidOperationException("Connection string 'SqlServer' is not configured.");

        return builder.UseSqlServer(connectionString);
    }
}
