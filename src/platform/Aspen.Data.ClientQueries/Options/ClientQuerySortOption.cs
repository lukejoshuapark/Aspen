using System.Linq.Expressions;
using System.Text.Json.Serialization;

namespace Aspen.Data.ClientQueries.Options;

public sealed class ClientQuerySortOption
{
    [JsonPropertyName("column")]
    public required string Column { get; set; }

    [JsonPropertyName("direction")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public SortDirection Direction { get; set; }
}

public enum SortDirection
{
    Ascending,
    Descending
}

public static class ClientQuerySortOptionExtensions
{
    public static IQueryable<T> ApplyTo<T>(this ClientQuerySortOption sort, IQueryable<T> queryable)
    {
        var expression = AsExpression<T>(sort);
        return sort.Direction == SortDirection.Descending
            ? queryable.OrderByDescending(expression)
            : queryable.OrderBy(expression);
    }

    public static IOrderedQueryable<T> ApplyTo<T>(this ClientQuerySortOption sort, IOrderedQueryable<T> queryable)
    {
        var expression = AsExpression<T>(sort);
        return sort.Direction == SortDirection.Descending
            ? queryable.ThenByDescending(expression)
            : queryable.ThenBy(expression);
    }

    private static Expression<Func<T, object>> AsExpression<T>(ClientQuerySortOption sort)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, sort.Column);
        var converted = Expression.Convert(property, typeof(object));
        return Expression.Lambda<Func<T, object>>(converted, parameter);
    }
}
