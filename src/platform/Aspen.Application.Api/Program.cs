using Aspen.Application.Api.Cors;
using Aspen.Configuration;
using Aspen.Data.Database;
using Aspen.Data.Database.Entities;
using Microsoft.EntityFrameworkCore;

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
        services.AddAspenCors();
        // SeedDatabase(services);

        var app = builder.Build();
        app.UseCors();
        app.MapControllers();

        app.Run();
    }

    private static void SeedDatabase(IServiceCollection services)
    {
        using var serviceProvider = services.BuildServiceProvider();
        var dbContextFactory = serviceProvider.GetRequiredService<IDbContextFactory<DatabaseContext>>();
        using var dbContext = dbContextFactory.CreateDbContext();
        var rand = new Random();

        dbContext.Users.Add(new User
        {
            Id = Guid.Parse("E31C78BB-4328-40D2-B460-570CF223580E"),
            DisplayName = "Test User"
        });

        for (var i = 0; i < 1000; i++)
        {
            dbContext.Posts.Add(new Post
            {
                Id = Guid.NewGuid(),
                UserId = Guid.Parse("E31C78BB-4328-40D2-B460-570CF223580E"),
                Title = GetRandomPostTitle(rand),
                Description = GetRandomPostDescription(rand),
                Likes = GetRandomPostLikes(rand)
            });
        }

        dbContext.SaveChanges();
    }

    private static string GetRandomPostTitle(Random rand)
    {
        var templateStrings = new[]
        {
            "The best {0} is also often {1}",
            "Why {0} is the key to {1}",
            "How to {0} and {1}",
            "Exploring the world of {0} and {1}",
            "Unveiling the secrets of {0} and {1}",
            "The ultimate guide to {0} and {1}",
            "Mastering the art of {0} and {1}",
            "The future of {0} and {1}",
            "Innovations in {0} and {1}",
            "The impact of {0} on {1}",
            "The evolution of {0} and {1}",
            "The intersection of {0} and {1}",
            "The synergy between {0} and {1}",
            "The relationship between {0} and {1}",
            "The challenges of {0} and {1}",
            "The benefits of {0} and {1}"
        };

        var firstWord = new[]
        {
            "technology", "health", "education", "finance", "art", "science", "culture", "sports", "travel", "food",
            "music", "literature", "history", "politics", "environment", "innovation", "design", "engineering", "psychology", "sociology",
            "philosophy", "economics", "law", "medicine", "architecture", "communication", "media", "gaming", "fashion", "lifestyle",
            "photography", "cinema", "theater", "dance", "poetry", "crafts", "gardening", "parenting", "relationships",
            "self-improvement", "spirituality", "wellness", "mindfulness", "productivity", "leadership", "teamwork", "entrepreneurship"
        };

        var secondWord = new[]
        {
            "innovation", "development", "strategy", "implementation", "analysis", "research", "design", "management",
            "marketing", "sales", "customer service", "support", "training", "consulting", "coaching", "mentoring",
            "networking", "collaboration", "partnerships", "community building"
        };

        var firstIndex = rand.Next(firstWord.Length);
        var secondIndex = rand.Next(secondWord.Length);
        return string.Format(templateStrings[rand.Next(templateStrings.Length)], firstWord[firstIndex], secondWord[secondIndex]);
    }

    private static string GetRandomPostDescription(Random rand)
    {
        var templateStrings = new[]
        {
            "In this post, we explore the fascinating world of {0} and {1}.",
            "Join us as we delve into the intricacies of {0} and {1}.",
            "Discover the latest trends in {0} and {1} with our in-depth analysis.",
            "This article provides a comprehensive overview of {0} and {1}.",
            "Learn how {0} and {1} are shaping the future of our society.",
            "We discuss the challenges and opportunities presented by {0} and {1}.",
            "This post highlights the key developments in {0} and {1}.",
            "Explore the impact of {0} on {1} in our latest article.",
            "We examine the relationship between {0} and {1} in detail.",
            "This piece offers insights into the evolution of {0} and {1}."
        };

        var firstWord = new[]
        {
            "technology", "health", "education", "finance", "art", "science", "culture", "sports", "travel", "food",
            "music", "literature", "history", "politics", "environment", "innovation", "design", "engineering", "psychology", "sociology",
            "philosophy", "economics", "law", "medicine", "architecture", "communication", "media", "gaming", "fashion", "lifestyle",
            "photography", "cinema", "theater", "dance", "poetry", "crafts", "gardening", "parenting"
        };

        var secondWord = new[]
        {
            "innovation", "development", "strategy", "implementation", "analysis", "research", "design",
            "management", "marketing"
        };

        var firstIndex = rand.Next(firstWord.Length);
        var secondIndex = rand.Next(secondWord.Length);
        return string.Format(templateStrings[rand.Next(templateStrings.Length)], firstWord[firstIndex], secondWord[secondIndex]);
    }

    private static int GetRandomPostLikes(Random rand)
    {
        return rand.Next(0, 1000);
    }
}
