namespace Aspen.Application.Api;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Configuration.Sources.Clear();
        builder.Configuration.AddJsonFile("Aspen.json");

        var services = builder.Services;
        services.AddControllers();

        var app = builder.Build();
        app.MapControllers();

        app.Run();
    }
}
