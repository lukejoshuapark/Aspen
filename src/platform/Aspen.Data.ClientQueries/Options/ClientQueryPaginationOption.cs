using System.Text.Json.Serialization;

namespace Aspen.Data.ClientQueries.Options;

public sealed class ClientQueryPaginationOption
{
    [JsonPropertyName("cursor")]
    public required uint Cursor { get; set; }

    [JsonPropertyName("pageSize")]
    public required uint PageSize { get; set; }
}

public static class ClientQueryPaginationOptionExtensions
{
    public static IQueryable<T> ApplyTo<T>(this ClientQueryPaginationOption pagination, IQueryable<T> queryable)
        => queryable
            .Skip((int)pagination.Cursor)
            .Take((int)pagination.PageSize);
}
