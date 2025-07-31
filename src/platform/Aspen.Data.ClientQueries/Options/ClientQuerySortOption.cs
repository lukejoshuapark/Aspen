using System.Linq.Expressions;

namespace Aspen.Data.ClientQueries.Options;

public sealed class ClientQuerySortOption
{
    public required string ColumnName { get; set; }
    public required SortDirection Direction { get; set; }
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
        var expression = sort.ToExpression<T>();
        return sort.Direction == SortDirection.Descending
            ? queryable.OrderByDescending(expression)
            : queryable.OrderBy(expression);
    }

    public static IOrderedQueryable<T> ApplyTo<T>(this ClientQuerySortOption sort, IOrderedQueryable<T> queryable)
    {
        var expression = sort.ToExpression<T>();
        return sort.Direction == SortDirection.Descending
            ? queryable.ThenByDescending(expression)
            : queryable.ThenBy(expression);
    }

    private static Expression<Func<T, object>> ToExpression<T>(this ClientQuerySortOption sort)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, sort.ColumnName);
        var converted = Expression.Convert(property, typeof(object));
        return Expression.Lambda<Func<T, object>>(converted, parameter);
    }
}
