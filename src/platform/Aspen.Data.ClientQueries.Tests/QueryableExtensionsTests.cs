using System.Text.Json;
using System.Text.RegularExpressions;
using Aspen.Data.ClientQueries.Options;
using Aspen.Data.Database;
using Microsoft.EntityFrameworkCore;

namespace Aspen.Data.ClientQueries.Tests;

public class QueryableExtensionsTests
{
    [Fact]
    public void ShouldProduceExpectedSqlForEmptyClientQueryOptions()
    {
        // Arrange.
        var clientQueryOptions = new ClientQueryOptions { };

        // Act.
        var sql = GetTestQueryable()
            .WithClientQuery(clientQueryOptions)
            .ToQueryString();

        // Assert.
        var expectedSql = @"
            DECLARE @__p_0 int = 0;
            DECLARE @__p_1 int = 1000;

            SELECT
                [p].[Id],
                [p].[Title],
                [p].[Description],
                [p].[Likes]
            FROM
                [Aspen].[Post] AS [p]
            ORDER BY
                (SELECT 1)
            OFFSET @__p_0 ROWS FETCH NEXT @__p_1 ROWS ONLY
        ";

        AssertNormalizedSql(expectedSql, sql);
    }

    [Theory]
    [InlineData(0, 1, 0, 1)]
    [InlineData(998, 999, 998, 999)]
    [InlineData(1001, 1000, 1001, 1000)]
    [InlineData(1001, 1001, 1001, 1000)]
    public void ShouldProduceExpectedSqlWhenPaginating(uint cursor, uint pageSize, uint expectedOffset, uint expectedFetch)
    {
        // Arrange.
        var clientQueryOptions = new ClientQueryOptions
        {
            Pagination = new ClientQueryPaginationOption
            {
                Cursor = cursor,
                PageSize = pageSize
            }
        };

        // Act.
        var sql = GetTestQueryable()
            .WithClientQuery(clientQueryOptions)
            .ToQueryString();

        // Assert.
        var expectedSql = $@"
            DECLARE @__p_0 int = {expectedOffset};
            DECLARE @__p_1 int = {expectedFetch};

            SELECT
                [p].[Id],
                [p].[Title],
                [p].[Description],
                [p].[Likes]
            FROM
                [Aspen].[Post] AS [p]
            ORDER BY
                (SELECT 1)
            OFFSET @__p_0 ROWS FETCH NEXT @__p_1 ROWS ONLY
        ";

        AssertNormalizedSql(expectedSql, sql);
    }

    [Fact]
    public void ShouldProduceExpectedSqlWhenSorting()
    {
        // Arrange.
        var clientQueryOptions = new ClientQueryOptions
        {
            Sorts = new[]
            {
                new ClientQuerySortOption
                {
                    Column = "Title",
                    Direction = SortDirection.Ascending
                },
                new ClientQuerySortOption
                {
                    Column = "Likes",
                    Direction = SortDirection.Descending
                }
            }
        };

        // Act.
        var sql = GetTestQueryable()
            .WithClientQuery(clientQueryOptions)
            .ToQueryString();

        // Assert.
        var expectedSql = @"
            DECLARE @__p_0 int = 0;
            DECLARE @__p_1 int = 1000;

            SELECT
                [p].[Id],
                [p].[Title],
                [p].[Description],
                [p].[Likes]
            FROM
                [Aspen].[Post] AS [p]
            ORDER BY
                [p].[Title],
                [p].[Likes] DESC
            OFFSET @__p_0 ROWS FETCH NEXT @__p_1 ROWS ONLY
        ";

        AssertNormalizedSql(expectedSql, sql);
    }

    [Fact]
    public void ShouldProduceExpectedSqlWhenFiltering()
    {
        // Arrange.
        var clientQueryOptions = new ClientQueryOptions
        {
            Filters = new[]
            {
                new ClientQueryFilterOption
                {
                    Operator = FilterOperator.And,
                    Filters = new[]
                    {
                        new ClientQueryFilterOption
                        {
                            Column = "Title",
                            Operator = FilterOperator.EqualTo,
                            Operand = JsonDocument.Parse("\"The title of my post\"").RootElement
                        },
                        new ClientQueryFilterOption
                        {
                            Operator = FilterOperator.Or,
                            Filters = new[]
                            {
                                new ClientQueryFilterOption
                                {
                                    Column = "Likes",
                                    Operator = FilterOperator.GreaterThan,
                                    Operand = JsonDocument.Parse("10").RootElement
                                },
                                new ClientQueryFilterOption
                                {
                                    Column = "Likes",
                                    Operator = FilterOperator.EqualTo,
                                    Operand = JsonDocument.Parse("5").RootElement
                                }
                            }
                        }
                    }
                }
            }
        };

        // Act.
        var sql = GetTestQueryable()
            .WithClientQuery(clientQueryOptions)
            .ToQueryString();

        // Assert.
        var expectedSql = @"
            DECLARE @__Value_0 nvarchar(4000) = N'The title of my post';
            DECLARE @__Value_1 int = 10;
            DECLARE @__Value_2 int = 5;
            DECLARE @__p_3 int = 0;
            DECLARE @__p_4 int = 1000;

            SELECT
                [p].[Id],
                [p].[Title],
                [p].[Description],
                [p].[Likes]
            FROM
                [Aspen].[Post] AS [p]
            WHERE
                [p].[Title] = @__Value_0 AND ([p].[Likes] > @__Value_1 OR [p].[Likes] = @__Value_2)
            ORDER BY
                (SELECT 1)
            OFFSET @__p_3 ROWS FETCH NEXT @__p_4 ROWS ONLY
        ";

        AssertNormalizedSql(expectedSql, sql);
    }

    private IQueryable<TestPost> GetTestQueryable()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseSqlServer("Server=localhost;Database=FakeDb;Trusted_Connection=True;")
            .Options;

        var dbContext = new DatabaseContext(options);

        return dbContext.Posts.Select(x => new TestPost
        {
            Id = x.Id,
            Title = x.Title,
            Description = x.Description,
            Likes = x.Likes
        });
    }

    private void AssertNormalizedSql(string expectedSql, string actualSql)
    {
        var regex = new Regex(@"\s+", RegexOptions.Compiled);
        var normalizedExpected = regex.Replace(expectedSql, " ").Trim();
        var normalizedActual = regex.Replace(actualSql, " ").Trim();

        Assert.Equal(normalizedExpected, normalizedActual);
    }

    private class TestPost
    {
        public required Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required int Likes { get; set; }
    }
}
