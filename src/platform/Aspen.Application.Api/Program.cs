using Aspen.Configuration;
using Aspen.Data.Database;

namespace Aspen.Application.Api;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var configuration = builder.Configuration;
        configuration.Sources.Clear();
        configuration.AddAspenConfiguration();

        var services = builder.Services;
        services.AddControllers();
        services.AddAspenDatabase(configuration);
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", builder =>
            {
                builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        var app = builder.Build();
        app.UseCors("AllowAll");
        app.MapControllers();

        app.Run();
    }
}
