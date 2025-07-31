using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Aspen.Data.Database;

public static class ServiceExtensions
{
    public static IServiceCollection AddAspenDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContextFactory<DatabaseContext>(options => options.UseAspenSqlServer(configuration));

        return services;
    }
}
