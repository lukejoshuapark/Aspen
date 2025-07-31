using System.Linq.Expressions;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Aspen.Data.ClientQueries.Options;

public class ClientQueryFilterOption
{
    [JsonPropertyName("column")]
    public string? Column { get; set; }

    [JsonPropertyName("operator")]
    [JsonConverter(typeof(JsonStringEnumConverter))] // TODO: Converter for actual symbols
    public ComparisonOperator? Operator { get; set; }

    [JsonPropertyName("operand")]
    public JsonElement? Operand { get; set; }
}

public static class ClientQueryFilterOptionExtensions
{
    public static IQueryable<T> ApplyTo<T>(this ClientQueryFilterOption filter, IQueryable<T> queryable)
        => queryable.Where(AsExpression<T>(filter));

    private static Expression<Func<T, bool>> AsExpression<T>(ClientQueryFilterOption filter)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
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
            ComparisonOperator.Equals => Expression.Equal(property, constant),
            ComparisonOperator.NotEquals => Expression.NotEqual(property, constant),
            ComparisonOperator.GreaterThan => Expression.GreaterThan(property, constant),
            ComparisonOperator.GreaterThanOrEqual => Expression.GreaterThanOrEqual(property, constant),
            ComparisonOperator.LessThan => Expression.LessThan(property, constant),
            ComparisonOperator.LessThanOrEqual => Expression.LessThanOrEqual(property, constant),
            _ => throw new NotSupportedException($"Filter operator {filter.Operator} is not supported.")
        };

        return Expression.Lambda<Func<T, bool>>(body, parameter);
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

public enum ComparisonOperator
{
    Equals,
    NotEquals,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual
}
