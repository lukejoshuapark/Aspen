namespace Aspen.Application.Api.Cors;

public static class ServiceExtensions
{
    public static IServiceCollection AddAspenCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(CorsPolicies.AllowAll, builder =>
            {
                builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        return services;
    }
}
