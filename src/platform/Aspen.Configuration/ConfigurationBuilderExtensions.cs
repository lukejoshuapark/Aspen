using Microsoft.Extensions.Configuration;

namespace Aspen.Configuration;

public static class ConfigurationBuilderExtensions
{
    public static IConfigurationBuilder AddAspenConfiguration(this IConfigurationBuilder builder)
    {
        var stream = typeof(ConfigurationBuilderExtensions).Assembly.GetManifestResourceStream("Aspen.Configuration.Aspen.json");
        if (stream == null)
            throw new InvalidOperationException("The Aspen.json embedded resource was not found.");

        builder.AddJsonStream(stream);
        return builder;
    }
}
