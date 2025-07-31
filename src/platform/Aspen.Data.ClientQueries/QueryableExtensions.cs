using Aspen.Data.ClientQueries.Options;

namespace Aspen.Data.ClientQueries;

public static class QueryableExtensions
{
    public static IQueryable<T> WithClientQuery<T>(this IQueryable<T> queryable, ClientQueryOptions options)
    {
        if (options.Filters != null)
        {
            foreach (var filter in options.Filters)
            {
                queryable = filter.ApplyTo(queryable);
            }
        }

        var firstSort = options.Sorts.FirstOrDefault();
        if (firstSort != null)
        {
            var orderedQueryable = firstSort.ApplyTo(queryable);

            foreach (var sort in options.Sorts.Skip(1))
            {
                orderedQueryable = sort.ApplyTo(orderedQueryable);
            }

            queryable = orderedQueryable;
        }

        return queryable;
    }
}
