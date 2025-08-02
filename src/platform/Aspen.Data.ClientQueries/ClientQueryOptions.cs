using System.Text.Json.Serialization;
using Aspen.Data.ClientQueries.Options;

namespace Aspen.Data.ClientQueries;

public class ClientQueryOptions
{
    [JsonPropertyName("filter")]
    public ClientQueryFilterOption[] Filters { get; set; } = [];

    [JsonPropertyName("sort")]
    public ClientQuerySortOption[] Sorts { get; set; } = [];

    [JsonPropertyName("pagination")]
    public ClientQueryPaginationOption? Pagination { get; set; }
}

public class TransformativeClientQueryOptions : ClientQueryOptions
{

}
