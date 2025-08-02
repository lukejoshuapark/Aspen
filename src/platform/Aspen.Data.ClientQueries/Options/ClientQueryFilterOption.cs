using System.Linq.Expressions;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Aspen.Data.ClientQueries.Options;

public class ClientQueryFilterOption
{
    [JsonPropertyName("column")]
    public string? Column { get; set; }

    [JsonPropertyName("operator")]
    [JsonConverter(typeof(JsonFilterOperatorConverter))]
    public FilterOperator? Operator { get; set; }

    [JsonPropertyName("operand")]
    public JsonElement? Operand { get; set; }

    [JsonPropertyName("filters")]
    public ClientQueryFilterOption[]? Filters { get; set; }
}

public static class ClientQueryFilterOptionExtensions
{
    public static IQueryable<T> ApplyTo<T>(this ClientQueryFilterOption filter, IQueryable<T> queryable)
        => queryable.Where(AsExpression<T>(filter));

    private static Expression<Func<T, bool>> AsExpression<T>(ClientQueryFilterOption filter, ParameterExpression? parameter = null)
    {
        parameter ??= Expression.Parameter(typeof(T), "x");

        return filter.Filters == null
            ? AsComparisonExpression<T>(filter, parameter)
            : AsLogicalExpression<T>(filter, parameter);
    }

    private static Expression<Func<T, bool>> AsComparisonExpression<T>(ClientQueryFilterOption filter, ParameterExpression parameter)
    {
        var property = Expression.Property(parameter, filter.Column!);
        var constant = filter.Operand?.ValueKind switch
        {
            JsonValueKind.String => Expression.Constant(filter.Operand.Value.GetString()),
            JsonValueKind.Number => Expression.Constant(GetNumberConstant(filter.Operand.Value, property.Type)),
            JsonValueKind.True => Expression.Constant(true),
            JsonValueKind.False => Expression.Constant(false),
            _ => throw new NotSupportedException($"Filter operand type {filter.Operand?.ValueKind} is not supported.")
        };

        var body = filter.Operator switch
        {
            FilterOperator.EqualTo => Expression.Equal(property, constant),
            FilterOperator.NotEqualTo => Expression.NotEqual(property, constant),
            FilterOperator.GreaterThan => Expression.GreaterThan(property, constant),
            FilterOperator.GreaterThanOrEqualTo => Expression.GreaterThanOrEqual(property, constant),
            FilterOperator.LessThan => Expression.LessThan(property, constant),
            FilterOperator.LessThanOrEqualTo => Expression.LessThanOrEqual(property, constant),
            _ => throw new NotSupportedException($"Filter operator {filter.Operator} is not supported for comparisons.")
        };

        return Expression.Lambda<Func<T, bool>>(body, parameter);
    }

    private static Expression<Func<T, bool>> AsLogicalExpression<T>(ClientQueryFilterOption filter, ParameterExpression parameter)
    {
        if (filter.Filters == null || filter.Filters.Length < 2)
            throw new ArgumentException("Logical filters must contain at least two sub-filters.", nameof(filter.Filters));

        var expressions = filter.Filters.Select(subFilter => AsExpression<T>(subFilter, parameter).Body);
        var combinedBody = filter.Operator switch
        {
            FilterOperator.And => expressions.Aggregate(Expression.AndAlso),
            FilterOperator.Or => expressions.Aggregate(Expression.OrElse),
            _ => throw new NotSupportedException($"Filter operator {filter.Operator} is not supported for logical operations.")
        };

        return Expression.Lambda<Func<T, bool>>(combinedBody, parameter);
    }

    private static object GetNumberConstant(JsonElement operand, Type type)
        => type switch
        {
            _ when type == typeof(byte) => operand.GetByte(),
            _ when type == typeof(short) => operand.GetInt16(),
            _ when type == typeof(ushort) => operand.GetUInt16(),
            _ when type == typeof(int) => operand.GetInt32(),
            _ when type == typeof(uint) => operand.GetUInt32(),
            _ when type == typeof(long) => operand.GetInt64(),
            _ when type == typeof(ulong) => operand.GetUInt64(),
            _ when type == typeof(float) => operand.GetSingle(),
            _ when type == typeof(double) => operand.GetDouble(),
            _ when type == typeof(decimal) => operand.GetDecimal(),
            _ => throw new NotSupportedException($"Number type {type} is not supported.")
        };
}

public enum FilterOperator
{
    EqualTo,
    NotEqualTo,
    GreaterThan,
    GreaterThanOrEqualTo,
    LessThan,
    LessThanOrEqualTo,
    And,
    Or
}

public class JsonFilterOperatorConverter : JsonConverter<FilterOperator>
{
    public override FilterOperator Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.String)
            throw new JsonException("Expected string for filter operator");

        var value = reader.GetString();
        return value switch
        {
            "==" => FilterOperator.EqualTo,
            "!=" => FilterOperator.NotEqualTo,
            ">" => FilterOperator.GreaterThan,
            ">=" => FilterOperator.GreaterThanOrEqualTo,
            "<" => FilterOperator.LessThan,
            "<=" => FilterOperator.LessThanOrEqualTo,
            "&&" => FilterOperator.And,
            "||" => FilterOperator.Or,
            _ => throw new JsonException($"Unknown filter operator: {reader.GetString()}")
        };
    }

    public override void Write(Utf8JsonWriter writer, FilterOperator value, JsonSerializerOptions _)
        => writer.WriteStringValue(value switch
        {
            FilterOperator.EqualTo => "==",
            FilterOperator.NotEqualTo => "!=",
            FilterOperator.GreaterThan => ">",
            FilterOperator.GreaterThanOrEqualTo => ">=",
            FilterOperator.LessThan => "<",
            FilterOperator.LessThanOrEqualTo => "<=",
            FilterOperator.And => "&&",
            FilterOperator.Or => "||",
            _ => throw new JsonException($"{value} is not a valid filter operator")
        });
}
